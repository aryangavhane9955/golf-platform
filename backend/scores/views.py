from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Score
from .serializers import ScoreSerializer

class ScoreListCreateView(generics.ListCreateAPIView):
    serializer_class = ScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Score.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        date = serializer.validated_data.get('date_played')
        if Score.objects.filter(user=self.request.user, date_played=date).exists():
            raise ValidationError('You already have a score for this date.')
        serializer.save(user=self.request.user)

class ScoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Score.objects.filter(user=self.request.user)