from rest_framework import serializers
from .models import Winner

class WinnerSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    draw_month = serializers.DateField(source='draw.month', read_only=True)

    class Meta:
        model = Winner
        fields = [
            'id', 'user_email', 'user_name', 'draw_month',
            'matched_count', 'prize_amount', 'proof_screenshot',
            'payment_status', 'submitted_at', 'verified_at',
            'paid_at', 'notes'
        ]
        read_only_fields = ['id', 'submitted_at', 'verified_at', 'paid_at']

    def get_user_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}'.strip() or obj.user.username