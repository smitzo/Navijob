from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

from apps.core.models import TimeStampedModel


class AccountState(TimeStampedModel):
    class Role(models.TextChoices):
        CANDIDATE = "candidate", "Candidate"
        RECRUITER = "recruiter", "Recruiter"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="account_state")
    role = models.CharField(max_length=20, choices=Role.choices)
    email_verified = models.BooleanField(default=False)
    verified_email = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.user.email}: {self.role}"


class ApplicantProfile(TimeStampedModel):
    class WorkMode(models.TextChoices):
        REMOTE = "remote", "Remote"
        HYBRID = "hybrid", "Hybrid"
        ONSITE = "onsite", "On-site"
        FLEXIBLE = "flexible", "Flexible"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="applicant_profile")
    headline = models.CharField(max_length=180, blank=True)
    summary = models.TextField(max_length=3000, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    notice_period_days = models.PositiveSmallIntegerField(default=0)
    public_visibility = models.BooleanField(default=False)
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


class Experience(TimeStampedModel):
    profile = models.ForeignKey(ApplicantProfile, on_delete=models.CASCADE, related_name="experiences")
    company = models.CharField(max_length=180)
    title = models.CharField(max_length=180)
    location = models.CharField(max_length=160, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(max_length=4000, blank=True)

    class Meta:
        ordering = ["-start_date", "-pk"]
        constraints = [models.CheckConstraint(condition=models.Q(end_date__isnull=True) | models.Q(end_date__gte=models.F("start_date")), name="experience_dates_ordered")]

    def clean(self):
        errors = {}
        if self.start_date and self.start_date > timezone.localdate():
            errors["start_date"] = "Experience cannot start in the future."
        if self.end_date and self.start_date and self.end_date < self.start_date:
            errors["end_date"] = "End date cannot be before the start date."
        if self.is_current and self.end_date:
            errors["end_date"] = "Leave the end date empty for a current role."
        if errors:
            raise ValidationError(errors)


class Education(TimeStampedModel):
    profile = models.ForeignKey(ApplicantProfile, on_delete=models.CASCADE, related_name="education")
    institution = models.CharField(max_length=180)
    qualification = models.CharField(max_length=180)
    field_of_study = models.CharField(max_length=180, blank=True)
    start_year = models.PositiveSmallIntegerField()
    end_year = models.PositiveSmallIntegerField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(max_length=2000, blank=True)

    class Meta:
        ordering = ["-start_year", "-pk"]
        constraints = [models.CheckConstraint(condition=models.Q(end_year__isnull=True) | models.Q(end_year__gte=models.F("start_year")), name="education_years_ordered")]

    def clean(self):
        errors = {}
        year = timezone.localdate().year
        if not 1900 <= self.start_year <= year:
            errors["start_year"] = "Enter a start year between 1900 and the current year."
        if self.end_year and (self.end_year < self.start_year or self.end_year > year + 8):
            errors["end_year"] = "Enter a valid completion or expected graduation year."
        if errors:
            raise ValidationError(errors)
