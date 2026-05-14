from rest_framework import serializers
from .models import WaitlistLead


class WaitlistLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitlistLead
        fields = ["id", "full_name", "email", "phone", "current_status", "interest", "source", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_email(self, value):
        return value.strip().lower()
