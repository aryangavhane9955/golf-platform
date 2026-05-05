from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Winner(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winnings')
    draw = models.ForeignKey('draws.Draw', on_delete=models.CASCADE, related_name='winners')
    matched_count = models.IntegerField()
    prize_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    proof_screenshot = models.ImageField(upload_to='winner_proofs/', null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f'{self.user.email} - Draw {self.draw.month} - {self.payment_status}'

    class Meta:
        ordering = ['-submitted_at']