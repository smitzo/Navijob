from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .auth_serializers import RegistrationSerializer
from .models import AccountState, ApplicantProfile
from .tokens import send_confirmation

User = get_user_model()


@method_decorator(csrf_protect, name="dispatch")
class AnonymousAccountView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "account"


class RegisterView(AnonymousAccountView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            with transaction.atomic():
                user = User.objects.create_user(username=data["email"], email=data["email"], password=data["password"], first_name=data["name"])
                AccountState.objects.create(user=user, role=data["role"])
                if data["role"] == AccountState.Role.CANDIDATE:
                    ApplicantProfile.objects.create(user=user)
                send_confirmation(user)
        except IntegrityError:
            return Response({"email": ["An account with this email already exists."]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Check your email to confirm your account before signing in."}, status=status.HTTP_201_CREATED)
