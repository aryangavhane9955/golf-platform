from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Winner
from .serializers import WinnerSerializer

class MyWinningsView(generics.ListAPIView):
    serializer_class = WinnerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Winner.objects.filter(user=self.request.user)

class SubmitProofView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        winner_id = request.data.get('winner_id')
        proof = request.FILES.get('proof_screenshot')

        try:
            winner = Winner.objects.get(id=winner_id, user=request.user)
            if proof:
                winner.proof_screenshot = proof
            winner.payment_status = 'pending'
            winner.save()
            return Response({'message': 'Proof submitted successfully'})
        except Winner.DoesNotExist:
            return Response({'error': 'Winner record not found'}, status=404)

class MyWinnerDetailView(generics.RetrieveAPIView):
    serializer_class = WinnerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Winner.objects.filter(user=self.request.user)

# Admin views
class AdminWinnersListView(generics.ListAPIView):
    serializer_class = WinnerSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        status = self.request.query_params.get('status', None)
        if status:
            return Winner.objects.filter(payment_status=status)
        return Winner.objects.all()

class AdminVerifyWinnerView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        action = request.data.get('action')
        notes = request.data.get('notes', '')

        try:
            winner = Winner.objects.get(pk=pk)
        except Winner.DoesNotExist:
            return Response({'error': 'Winner not found'}, status=404)

        if action == 'approve':
            winner.payment_status = 'approved'
            winner.verified_at = timezone.now()
            winner.notes = notes
            winner.save()
            return Response({'message': 'Winner approved'})

        elif action == 'reject':
            winner.payment_status = 'rejected'
            winner.verified_at = timezone.now()
            winner.notes = notes
            winner.save()
            return Response({'message': 'Winner rejected'})

        elif action == 'mark_paid':
            winner.payment_status = 'paid'
            winner.paid_at = timezone.now()
            winner.save()
            return Response({'message': 'Winner marked as paid'})

        return Response({'error': 'Invalid action'}, status=400)