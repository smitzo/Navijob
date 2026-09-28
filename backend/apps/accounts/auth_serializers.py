from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import AccountState

User = get_user_model()


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=150)
    name = serializers.CharField(min_length=2, max_length=150)
    password = serializers.CharField(min_length=10, max_length=128, write_only=True, trim_whitespace=False)
    role = serializers.ChoiceField(choices=AccountState.Role.choices)

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists() or User.objects.filter(username=value).exists():
            raise serializers.ValidationError("An account with this email already exists. Try signing in.")
        return value

    def validate(self, data):
        candidate = User(username=data["email"], email=data["email"], first_name=data["name"])
        try:
            validate_password(data["password"], candidate)
        except DjangoValidationError as error:
            raise serializers.ValidationError({"password": error.messages}) from error
        return data
