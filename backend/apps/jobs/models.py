from django.db import models
from django.core.exceptions import ValidationError
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
    responsibilities = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)
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
    premium_score = models.PositiveSmallIntegerField(default=0)
    featured_until = models.DateTimeField(null=True, blank=True)
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
            models.Index(fields=["is_premium", "premium_score"]),
        ]
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title

    def clean(self):
        errors = {}

        if self.experience_max is not None and self.experience_min > self.experience_max:
            errors["experience_max"] = "Maximum experience must be greater than or equal to minimum experience."

        if self.salary_min is not None and self.salary_max is not None and self.salary_min > self.salary_max:
            errors["salary_max"] = "Maximum salary must be greater than or equal to minimum salary."

        if self.equity_min is not None and self.equity_max is not None and self.equity_min > self.equity_max:
            errors["equity_max"] = "Maximum equity must be greater than or equal to minimum equity."

        if self.premium_score > 100:
            errors["premium_score"] = "Premium score must be between 0 and 100."

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


class JobApplication(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SUBMITTED = "submitted", "Submitted"
        REVIEWING = "reviewing", "Reviewing"
        SHORTLISTED = "shortlisted", "Shortlisted"
        REJECTED = "rejected", "Rejected"
        WITHDRAWN = "withdrawn", "Withdrawn"
        HIRED = "hired", "Hired"

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    applicant = models.ForeignKey("accounts.ApplicantProfile", on_delete=models.CASCADE, related_name="applications")
    resume = models.ForeignKey(
        "resumes.Resume",
        on_delete=models.SET_NULL,
        related_name="job_applications",
        null=True,
        blank=True,
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    cover_letter = models.TextField(blank=True)
    answers = models.JSONField(default=dict, blank=True)
    source = models.CharField(max_length=120, default="navijob")
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "job_applications"
        constraints = [
            models.UniqueConstraint(fields=["job", "applicant"], name="unique_application_per_job_applicant"),
        ]
        indexes = [
            models.Index(fields=["job", "status"]),
            models.Index(fields=["applicant", "status"]),
            models.Index(fields=["submitted_at"]),
        ]
        ordering = ["-submitted_at", "-created_at"]

    def __str__(self):
        return f"{self.applicant} -> {self.job}"

    def clean(self):
        errors = {}

        if self.job_id and not self.job.is_active:
            errors["job"] = "Applications can only be created for active jobs."

        if self.job_id and self.job.status != Job.Status.PUBLISHED:
            errors["job"] = "Applications can only be created for published jobs."

        if self.resume_id and self.resume.user_id != self.applicant.user_id:
            errors["resume"] = "The selected resume must belong to the applicant."

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
