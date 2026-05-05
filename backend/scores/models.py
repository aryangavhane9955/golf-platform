from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model

User = get_user_model()

class Score(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='scores'
    )
    value = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(45)]
    )
    date_played = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date_played')
        ordering = ['-date_played']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        all_scores = Score.objects.filter(user=self.user).order_by('-date_played')
        if all_scores.count() > 5:
            ids_to_delete = list(all_scores.values_list('id', flat=True)[5:])
            Score.objects.filter(id__in=ids_to_delete).delete()

    def __str__(self):
        return f'{self.user.email} — {self.value} pts on {self.date_played}'