from django.urls import path
from .auth_views import LoginView, LogoutView, RegisterView, SessionView

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="account-signup"),
    path("login/", LoginView.as_view(), name="account-login"),
    path("logout/", LogoutView.as_view(), name="account-logout"),
    path("session/", SessionView.as_view(), name="account-session"),
]
