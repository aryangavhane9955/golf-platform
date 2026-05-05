from rest_framework import serializers
from .models import Draw, DrawEntry

class DrawEntrySerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = DrawEntry
        fields = ['id', 'user_email', 'scores_snapshot', 'matched_count', 'is_winner']

class DrawSerializer(serializers.ModelSerializer):
    entries_count = serializers.SerializerMethodField()
    winners_count = serializers.SerializerMethodField()

    class Meta:
        model = Draw
        fields = [
            'id', 'month', 'draw_type', 'winning_numbers',
            'status', 'jackpot_rollover', 'created_at',
            'published_at', 'entries_count', 'winners_count'
        ]

    def get_entries_count(self, obj):
        return obj.entries.count()

    def get_winners_count(self, obj):
        return obj.entries.filter(is_winner=True).count()