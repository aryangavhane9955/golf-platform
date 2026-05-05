from django.urls import path
from .views import CharityListView, CharityDetailView, SelectCharityView

urlpatterns = [
    path('', CharityListView.as_view(), name='charity-list'),
    path('<int:pk>/', CharityDetailView.as_view(), name='charity-detail'),
    path('select/', SelectCharityView.as_view(), name='charity-select'),
]