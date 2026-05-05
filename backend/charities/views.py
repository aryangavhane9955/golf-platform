from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Charity
from .serializers import CharitySerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CharityListView(generics.ListAPIView):
    serializer_class = CharitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Charity.objects.filter(is_active=True)

class CharityDetailView(generics.RetrieveAPIView):
    serializer_class = CharitySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Charity.objects.all()

class SelectCharityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        charity_id = request.data.get('charity_id')
        percentage = request.data.get('percentage', 10)
        try:
            charity = Charity.objects.get(id=charity_id, is_active=True)
            request.user.selected_charity = charity
            request.user.charity_percentage = percentage
            request.user.save()
            return Response({'message': 'Charity selected successfully'})
        except Charity.DoesNotExist:
            return Response({'error': 'Charity not found'}, status=404)