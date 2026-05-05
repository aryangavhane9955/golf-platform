import stripe
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from utils.stripe_helpers import create_checkout_session

User = get_user_model()
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

class CreateCheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan = request.data.get('plan', 'monthly')
        try:
            url = create_checkout_session(request.user, plan)
            return Response({'url': url})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except Exception:
            return Response({'error': 'Invalid signature'}, status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session['metadata'].get('user_id')
            plan = 'yearly' if 'year' in session.get('amount_subtotal', '') else 'monthly'
            try:
                user = User.objects.get(id=user_id)
                user.subscription_status = 'active'
                user.subscription_plan = plan
                user.stripe_customer_id = session.get('customer', '')
                user.stripe_subscription_id = session.get('subscription', '')
                user.save()
            except User.DoesNotExist:
                pass

        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            try:
                user = User.objects.get(
                    stripe_subscription_id=subscription['id']
                )
                user.subscription_status = 'cancelled'
                user.save()
            except User.DoesNotExist:
                pass

        return Response({'status': 'ok'})