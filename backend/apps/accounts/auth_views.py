from django.contrib.auth import authenticate, get_user_model, login, logout
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
from .permissions import verified_state

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


def account_payload(user, state):
    return {"id": user.pk, "name": user.get_full_name(), "email": user.email, "role": state.role, "email_verified": state.email_verified}


class LoginView(AnonymousAccountView):
    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()[:150]
        password = request.data.get("password", "")
        if not isinstance(password, str) or len(password) > 128:
            return Response({"detail": "Email or password is incorrect."}, status=400)
        existing = User.objects.filter(email__iexact=email).first()
        user = authenticate(request._request, username=existing.username if existing else email, password=password)
        if user is None:
            return Response({"detail": "Email or password is incorrect."}, status=400)
        state = verified_state(user)
        if state is None:
            return Response({"detail": "Confirm your email before signing in.", "code": "email_unconfirmed"}, status=403)
        login(request._request, user)
        return Response({"user": account_payload(user, state)})


class LogoutView(AnonymousAccountView):
    def post(self, request):
        logout(request._request)
        return Response({"detail": "Signed out."})


class SessionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        state = verified_state(request.user)
        return Response({"user": account_payload(request.user, state) if state else None})
