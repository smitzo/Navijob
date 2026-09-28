from urllib.parse import urlencode

from django.conf import settings
from django.core import signing
from django.core.mail import send_mail
from django.utils.crypto import salted_hmac

CONFIRMATION_SALT = "navijob.confirm-email.v1"


def send_confirmation(user):
    token = signing.dumps({"user": user.pk, "email": user.email, "version": salted_hmac("navijob.confirm-password", user.password).hexdigest()}, salt=CONFIRMATION_SALT, compress=True)
    link = f"{settings.FRONTEND_URL}/confirm-email?{urlencode({'token': token})}"
    send_mail("Confirm your NaviJob email", f"Confirm your email to start your NaviJob profile:\n\n{link}\n\nThis link expires in 24 hours. If you didn’t sign up, ignore this email.", settings.DEFAULT_FROM_EMAIL, [user.email])
