from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.response import Response

from .auth_views import AnonymousAccountView

User = get_user_model()


class RecoveryView(AnonymousAccountView):
    throttle_scope = "email"

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()[:150]
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user and user.has_usable_password():
            values = {"uid": urlsafe_base64_encode(force_bytes(user.pk)), "token": default_token_generator.make_token(user)}
            link = f"{settings.FRONTEND_URL}/reset-password?{urlencode(values)}"
            send_mail("Reset your NaviJob password", f"Choose a new password:\n\n{link}\n\nThis link expires in one hour. Ignore it if you didn’t request a reset.", settings.DEFAULT_FROM_EMAIL, [user.email])
        return Response({"detail": "If an active account uses this email, a password reset link has been sent."})


class ResetPasswordView(AnonymousAccountView):
    def post(self, request):
        uid, token, password = (request.data.get(key, "") for key in ("uid", "token", "password"))
        if not all(isinstance(value, str) for value in (uid, token, password)) or len(uid) > 100 or len(token) > 200:
            return Response({"detail": "This reset link is invalid or expired."}, status=400)
        try:
            user = User.objects.get(pk=force_str(urlsafe_base64_decode(uid)), is_active=True)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError, UnicodeDecodeError):
            return Response({"detail": "This reset link is invalid or expired."}, status=400)
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "This reset link is invalid or expired. Request a new one."}, status=400)
        try:
            if len(password) < 10 or len(password) > 128:
                raise ValidationError("Use a password between 10 and 128 characters.")
            validate_password(password, user)
        except ValidationError as error:
            return Response({"password": error.messages}, status=400)
        user.set_password(password)
        user.save(update_fields=["password"])
        return Response({"detail": "Password updated. Sign in with your new password."})
