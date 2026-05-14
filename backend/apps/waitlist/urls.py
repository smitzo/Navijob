from django.urls import path
from .views import WaitlistLeadCreateView

urlpatterns = [
    path("", WaitlistLeadCreateView.as_view(), name="waitlist-create"),
]
