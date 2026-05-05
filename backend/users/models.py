from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    SUBSCRIPTION_PLANS = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    SUBSCRIPTION_STATUS = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('lapsed', 'Lapsed'),
        ('cancelled', 'Cancelled'),
    ]

    email = models.EmailField(unique=True)
    subscription_plan = models.CharField(
        max_length=10, choices=SUBSCRIPTION_PLANS, blank=True
    )
    subscription_status = models.CharField(
        max_length=20, choices=SUBSCRIPTION_STATUS, default='inactive'
    )
    subscription_start = models.DateField(null=True, blank=True)
    subscription_end = models.DateField(null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    charity_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=10.00
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    @property
    def is_subscribed(self):
        return self.subscription_status == 'active'

    def __str__(self):
        return self.email