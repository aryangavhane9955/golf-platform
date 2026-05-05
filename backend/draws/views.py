from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Draw, DrawEntry
from .serializers import DrawSerializer, DrawEntrySerializer
from .engine import run_random_draw, run_algorithmic_draw, check_matches
from scores.models import Score

class DrawListView(generics.ListAPIView):
    serializer_class = DrawSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Draw.objects.filter(status='published')

class DrawDetailView(generics.RetrieveAPIView):
    serializer_class = DrawSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Draw.objects.all()

class MyDrawEntriesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        entries = DrawEntry.objects.filter(
            user=request.user
        ).select_related('draw').order_by('-draw__month')
        data = []
        for entry in entries:
            data.append({
                'draw_month': entry.draw.month,
                'draw_status': entry.draw.status,
                'winning_numbers': entry.draw.winning_numbers,
                'my_scores': entry.scores_snapshot,
                'matched_count': entry.matched_count,
                'is_winner': entry.is_winner,
            })
        return Response(data)

# Admin only views
class AdminDrawCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        month = request.data.get('month')
        draw_type = request.data.get('draw_type', 'random')

        if Draw.objects.filter(month=month).exists():
            return Response({'error': 'Draw for this month already exists'}, status=400)

        draw = Draw.objects.create(month=month, draw_type=draw_type)
        serializer = DrawSerializer(draw)
        return Response(serializer.data)

class AdminDrawSimulateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            draw = Draw.objects.get(pk=pk)
        except Draw.DoesNotExist:
            return Response({'error': 'Draw not found'}, status=404)

        # Generate winning numbers
        if draw.draw_type == 'algorithmic':
            all_scores = list(Score.objects.values_list('value', flat=True))
            winning_numbers = run_algorithmic_draw(all_scores)
        else:
            winning_numbers = run_random_draw()

        draw.winning_numbers = winning_numbers
        draw.status = 'simulated'
        draw.save()

        # Calculate matches for all eligible users
        entries_created = 0
        from django.contrib.auth import get_user_model
        User = get_user_model()

        for user in User.objects.filter(subscription_status='active'):
            scores = list(Score.objects.filter(user=user).values_list('value', flat=True))
            if len(scores) == 5:
                matched = check_matches(scores, winning_numbers)
                DrawEntry.objects.update_or_create(
                    draw=draw, user=user,
                    defaults={
                        'scores_snapshot': scores,
                        'matched_count': matched,
                        'is_winner': matched >= 3,
                    }
                )
                entries_created += 1

        return Response({
            'winning_numbers': winning_numbers,
            'entries_processed': entries_created,
            'status': 'simulated'
        })

class AdminDrawPublishView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            draw = Draw.objects.get(pk=pk)
        except Draw.DoesNotExist:
            return Response({'error': 'Draw not found'}, status=404)

        draw.status = 'published'
        draw.published_at = timezone.now()
        draw.save()

        return Response({'message': 'Draw published successfully'})