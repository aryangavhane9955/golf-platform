from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Draw(models.Model):
    DRAW_TYPES = [('random', 'Random'), ('algorithmic', 'Algorithmic')]
    STATUS = [
        ('draft', 'Draft'),
        ('simulated', 'Simulated'),
        ('published', 'Published'),
    ]

    month = models.DateField()
    draw_type = models.CharField(max_length=20, choices=DRAW_TYPES, default='random')
    winning_numbers = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    jackpot_rollover = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-month']

    def __str__(self):
        return f'Draw {self.month.strftime("%B %Y")} - {self.status}'


class DrawEntry(models.Model):
    draw = models.ForeignKey(Draw, on_delete=models.CASCADE, related_name='entries')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scores_snapshot = models.JSONField()
    matched_count = models.IntegerField(default=0)
    is_winner = models.BooleanField(default=False)

    class Meta:
        unique_together = ('draw', 'user')

    def __str__(self):
        return f'{self.user.email} - Draw {self.draw.month}'