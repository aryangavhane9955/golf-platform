import stripe
import os

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

def create_checkout_session(user, plan):
    price_id = os.getenv('STRIPE_MONTHLY_PRICE_ID') if plan == 'monthly' \
               else os.getenv('STRIPE_YEARLY_PRICE_ID')

    session = stripe.checkout.Session.create(
        customer_email=user.email,
        payment_method_types=['card'],
        line_items=[{'price': price_id, 'quantity': 1}],
        mode='subscription',
        success_url='http://localhost:5173/dashboard?success=true',
        cancel_url='http://localhost:5173/subscribe?cancelled=true',
        metadata={'user_id': str(user.id)}
    )
    return session.url

def cancel_subscription(stripe_subscription_id):
    stripe.Subscription.delete(stripe_subscription_id)