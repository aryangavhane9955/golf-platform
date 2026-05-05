from django.urls import path
from .views import CreateCheckoutView, StripeWebhookView

urlpatterns = [
    path('create-checkout/', CreateCheckoutView.as_view(), name='create-checkout'),
    path('webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
]