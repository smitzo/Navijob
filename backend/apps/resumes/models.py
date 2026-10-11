from django.conf import settings
from django.db import models
from apps.core.models import TimeStampedModel
from uuid import uuid4


def private_resume_path(instance, filename):
    return f"resumes/{instance.user_id}/{uuid4().hex}.pdf"


class Resume(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resumes")
    title = models.CharField(max_length=160, default="My Resume")
    template = models.CharField(max_length=80, default="classic")
    data_json = models.JSONField(default=dict)
    pdf_file = models.FileField(upload_to=private_resume_path, blank=True, null=True)
    original_filename = models.CharField(max_length=255, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    ats_score = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        db_table = "resumes"
        ordering = ["-updated_at"]

    def __str__(self):
        return self.title
