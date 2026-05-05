from django.urls import path
from .views import ScoreListCreateView, ScoreDetailView

urlpatterns = [
    path('', ScoreListCreateView.as_view(), name='score-list'),
    path('<int:pk>/', ScoreDetailView.as_view(), name='score-detail'),
]