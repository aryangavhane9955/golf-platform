from django.urls import path
from .views import (
    DrawListView,
    DrawDetailView,
    MyDrawEntriesView,
    AdminDrawCreateView,
    AdminDrawSimulateView,
    AdminDrawPublishView,
)

urlpatterns = [
    path('', DrawListView.as_view(), name='draw-list'),
    path('<int:pk>/', DrawDetailView.as_view(), name='draw-detail'),
    path('my-entries/', MyDrawEntriesView.as_view(), name='my-entries'),
    path('admin/create/', AdminDrawCreateView.as_view(), name='admin-draw-create'),
    path('admin/<int:pk>/simulate/', AdminDrawSimulateView.as_view(), name='admin-draw-simulate'),
    path('admin/<int:pk>/publish/', AdminDrawPublishView.as_view(), name='admin-draw-publish'),
]