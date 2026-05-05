from django.contrib import admin
from .models import Winner

@admin.register(Winner)
class WinnerAdmin(admin.ModelAdmin):
    list_display = ['user', 'draw', 'matched_count', 'prize_amount', 'payment_status', 'submitted_at']
    list_filter = ['payment_status', 'matched_count']
    search_fields = ['user__email']
    readonly_fields = ['submitted_at', 'verified_at', 'paid_at']