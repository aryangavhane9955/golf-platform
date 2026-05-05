from django.contrib import admin
from .models import Draw, DrawEntry

@admin.register(Draw)
class DrawAdmin(admin.ModelAdmin):
    list_display = ['month', 'draw_type', 'status', 'winning_numbers', 'published_at']
    list_filter = ['status', 'draw_type']
    ordering = ['-month']

@admin.register(DrawEntry)
class DrawEntryAdmin(admin.ModelAdmin):
    list_display = ['user', 'draw', 'matched_count', 'is_winner']
    list_filter = ['is_winner']