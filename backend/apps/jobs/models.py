from django.db import models
from apps.core.models import TimeStampedModel


class Job(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        CLOSED = "closed", "Closed"
        ARCHIVED = "archived", "Archived"

    class Seniority(models.TextChoices):
        INTERN = "intern", "Intern"
        JUNIOR = "junior", "Junior"
        MID = "mid", "Mid-level"
        SENIOR = "senior", "Senior"
        LEAD = "lead", "Lead"
        EXECUTIVE = "executive", "Executive"

    class WorkMode(models.TextChoices):
        REMOTE = "remote", "Remote"
        HYBRID = "hybrid", "Hybrid"
        ONSITE = "onsite", "On-site"

    class JobType(models.TextChoices):
        FULL_TIME = "full_time", "Full-time"
        INTERNSHIP = "internship", "Internship"
        CONTRACT = "contract", "Contract"
        PART_TIME = "part_time", "Part-time"

    class SalaryPeriod(models.TextChoices):
        YEAR = "year", "Year"
        MONTH = "month", "Month"
        HOUR = "hour", "Hour"

    company = models.ForeignKey("companies.Company", on_delete=models.CASCADE, related_name="jobs")
    posted_by = models.ForeignKey(
        "accounts.RecruiterProfile",
        on_delete=models.SET_NULL,
        related_name="posted_jobs",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=260, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    seniority = models.CharField(max_length=20, choices=Seniority.choices, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=180, blank=True)
    work_mode = models.CharField(max_length=20, choices=WorkMode.choices, default=WorkMode.ONSITE)
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    experience_min = models.PositiveSmallIntegerField(default=0)
    experience_max = models.PositiveSmallIntegerField(null=True, blank=True)
    currency = models.CharField(max_length=3, default="USD")
    salary_min = models.PositiveIntegerField(null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    salary_period = models.CharField(max_length=10, choices=SalaryPeriod.choices, default=SalaryPeriod.YEAR)
    equity_min = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    equity_max = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    apply_url = models.URLField()
    apply_email = models.EmailField(blank=True)
    source = models.CharField(max_length=160, blank=True)
    is_verified = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    application_deadline = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "jobs"
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
            models.Index(fields=["is_active", "published_at"]),
            models.Index(fields=["work_mode", "job_type"]),
            models.Index(fields=["company", "status"]),
            models.Index(fields=["posted_by", "status"]),
        ]
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title
