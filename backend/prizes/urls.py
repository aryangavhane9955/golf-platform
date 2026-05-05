from django.urls import path
from .views import (
    MyWinningsView,
    SubmitProofView,
    MyWinnerDetailView,
    AdminWinnersListView,
    AdminVerifyWinnerView,
)

urlpatterns = [
    path('my-winnings/', MyWinningsView.as_view(), name='my-winnings'),
    path('submit-proof/', SubmitProofView.as_view(), name='submit-proof'),
    path('<int:pk>/', MyWinnerDetailView.as_view(), name='winner-detail'),
    path('admin/all/', AdminWinnersListView.as_view(), name='admin-winners'),
    path('admin/<int:pk>/verify/', AdminVerifyWinnerView.as_view(), name='admin-verify'),
]