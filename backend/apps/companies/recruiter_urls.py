from django.urls import path
from .onboarding import CompanyOnboardingView
urlpatterns = [path("company/", CompanyOnboardingView.as_view())]
