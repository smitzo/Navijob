from django.utils import timezone
from rest_framework.exceptions import ValidationError
from .applications import ApplicationConflict
from .models import ApplicationEvent, JobApplication

TRANSITIONS = {
    "submitted": ["reviewing", "rejected"],
    "reviewing": ["shortlisted", "interview", "rejected"],
    "shortlisted": ["interview", "rejected"],
    "interview": ["offer", "rejected"],
    "offer": ["hired", "rejected"],
    "hired": [], "rejected": [], "withdrawn": [], "draft": [],
}


def move_application(application, user, target, expected):
    if application.status == target:
        return application
    if application.status != expected:
        raise ApplicationConflict({"detail": "This application changed. Refresh before updating its stage.", "code": "stage_changed"})
    if target not in TRANSITIONS.get(application.status, []):
        raise ValidationError("That stage change is not allowed from the current status.")
    application.status = target
    application.reviewed_at = application.reviewed_at or timezone.now()
    application.save(update_fields=["status", "reviewed_at", "updated_at"])
    label = JobApplication.Status(target).label
    ApplicationEvent.objects.create(application=application, actor=user, status=target, note=f"Hiring team changed the stage to {label}.")
    application.refresh_from_db()
    return application
