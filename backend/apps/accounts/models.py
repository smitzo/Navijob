from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class ApplicantProfile(TimeStampedModel):
    class WorkMode(models.TextChoices):
        REMOTE = "remote", "Remote"
        HYBRID = "hybrid", "Hybrid"
        ONSITE = "onsite", "On-site"
        FLEXIBLE = "flexible", "Flexible"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="applicant_profile")
    headline = models.CharField(max_length=180, blank=True)
    current_title = models.CharField(max_length=160, blank=True)
    location = models.CharField(max_length=160, blank=True)
    experience_years = models.PositiveSmallIntegerField(default=0)
    preferred_work_mode = models.CharField(max_length=20, choices=WorkMode.choices, default=WorkMode.FLEXIBLE)
    target_roles = models.JSONField(default=list, blank=True)
    target_locations = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    is_open_to_work = models.BooleanField(default=True)
    available_from = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "applicant_profiles"
        indexes = [
            models.Index(fields=["is_open_to_work", "preferred_work_mode"]),
            models.Index(fields=["location"]),
        ]
        ordering = ["user__first_name", "user__email"]

    def __str__(self):
        display_name = self.user.get_full_name() or self.user.get_username()
        return f"Applicant: {display_name}"


class RecruiterProfile(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recruiter_profile")
    company = models.ForeignKey("companies.Company", on_delete=models.PROTECT, related_name="recruiters")
    title = models.CharField(max_length=160, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    linkedin_url = models.URLField(blank=True)
    can_manage_company = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    class Meta:
        db_table = "recruiter_profiles"
        indexes = [
            models.Index(fields=["company", "is_verified"]),
            models.Index(fields=["can_manage_company"]),
        ]
        ordering = ["company__name", "user__first_name", "user__email"]

    def __str__(self):
        display_name = self.user.get_full_name() or self.user.get_username()
        return f"Recruiter: {display_name} at {self.company.name}"
