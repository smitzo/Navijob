from django.urls import path
from .auth_views import ConfirmEmailView, LoginView, LogoutView, RegisterView, ResendConfirmationView, SessionView
from .recovery_views import RecoveryView, ResetPasswordView

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="account-signup"),
    path("login/", LoginView.as_view(), name="account-login"),
    path("logout/", LogoutView.as_view(), name="account-logout"),
    path("session/", SessionView.as_view(), name="account-session"),
    path("confirm-email/", ConfirmEmailView.as_view(), name="account-confirm"),
    path("resend-confirmation/", ResendConfirmationView.as_view(), name="account-resend"),
    path("recovery/", RecoveryView.as_view(), name="account-recovery"),
    path("reset-password/", ResetPasswordView.as_view(), name="account-reset"),
]
