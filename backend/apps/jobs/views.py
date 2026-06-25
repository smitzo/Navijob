from django.db.models import Q
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.jobs.models import Job, JobApplication
from apps.jobs.serializers import JobApplicationSerializer, JobDetailSerializer, JobListSerializer


class PublicJobViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"

    def get_queryset(self):
        queryset = (
            Job.objects.select_related("company", "posted_by", "posted_by__user")
            .filter(is_active=True, status=Job.Status.PUBLISHED)
            .order_by("-is_premium", "-premium_score", "-published_at", "-created_at")
        )

        query = self.request.query_params.get("q")
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query)
                | Q(company__name__icontains=query)
                | Q(description__icontains=query)
                | Q(location__icontains=query)
            )

        for field in ("work_mode", "job_type", "seniority"):
            value = self.request.query_params.get(field)
            if value:
                queryset = queryset.filter(**{field: value})

        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(location__icontains=location)

        is_premium = self.request.query_params.get("is_premium")
        if is_premium in {"true", "false"}:
            queryset = queryset.filter(is_premium=is_premium == "true")

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return JobDetailSerializer
        return JobListSerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        applicant_profile = getattr(self.request.user, "applicant_profile", None)
        if applicant_profile is None:
            return JobApplication.objects.none()

        return (
            JobApplication.objects.select_related("job", "job__company", "applicant", "applicant__user", "resume")
            .filter(applicant=applicant_profile)
            .order_by("-submitted_at", "-created_at")
        )

    def perform_create(self, serializer):
        applicant_profile = getattr(self.request.user, "applicant_profile", None)
        if applicant_profile is None:
            raise PermissionDenied("Create an applicant profile before applying to jobs.")

        serializer.save(applicant=applicant_profile, status=JobApplication.Status.SUBMITTED, submitted_at=timezone.now())
