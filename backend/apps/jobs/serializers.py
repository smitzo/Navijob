from django.utils import timezone
from rest_framework import serializers

from apps.accounts.serializers import ApplicantProfileSerializer, RecruiterProfileSerializer
from apps.companies.serializers import CompanySummarySerializer
from apps.jobs.models import Job, JobApplication


class JobListSerializer(serializers.ModelSerializer):
    company = CompanySummarySerializer(read_only=True)
    accepting_applications = serializers.BooleanField(read_only=True)

    class Meta:
        model = Job
        fields = (
            "id",
            "application_mode",
            "accepting_applications",
            "is_sample",
            "title",
            "slug",
            "company",
            "status",
            "seniority",
            "location",
            "work_mode",
            "job_type",
            "currency",
            "salary_min",
            "salary_max",
            "salary_period",
            "equity_min",
            "equity_max",
            "skills",
            "is_verified",
            "is_premium",
            "premium_score",
            "published_at",
            "expires_at",
            "application_deadline",
        )


class JobDetailSerializer(JobListSerializer):
    posted_by = serializers.SerializerMethodField()

    def get_posted_by(self, job):
        if not job.posted_by:
            return None
        return {"name": job.posted_by.user.get_full_name(), "title": job.posted_by.title}

    class Meta(JobListSerializer.Meta):
        fields = JobListSerializer.Meta.fields + (
            "posted_by",
            "description",
            "responsibilities",
            "requirements",
            "benefits",
            "apply_url",
            "apply_email",
            "source",
            "featured_until",
            "created_at",
            "updated_at",
            "application_questions",
        )


class JobApplicationSerializer(serializers.ModelSerializer):
    applicant = ApplicantProfileSerializer(read_only=True)
    job = JobListSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all(), source="job", write_only=True)

    class Meta:
        model = JobApplication
        fields = (
            "id",
            "job",
            "job_id",
            "applicant",
            "resume",
            "status",
            "cover_letter",
            "answers",
            "source",
            "submitted_at",
            "reviewed_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("status", "submitted_at", "reviewed_at", "created_at", "updated_at")

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if not self.instance and not attrs.get("submitted_at"):
            attrs["submitted_at"] = timezone.now()
        return attrs
