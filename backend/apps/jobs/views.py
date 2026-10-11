from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.jobs.models import Job, JobApplication
from apps.jobs.serializers import JobApplicationSerializer, JobDetailSerializer, JobListSerializer
from apps.jobs.filters import JobFilters, JobPagination


class PublicJobViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    pagination_class = JobPagination

    def get_queryset(self):
        queryset = Job.objects.select_related("company", "posted_by", "posted_by__user")
        if self.action == "retrieve":
            queryset = queryset.filter(review_status=Job.ReviewStatus.APPROVED, status__in=[Job.Status.PUBLISHED, Job.Status.CLOSED])
        else:
            queryset = queryset.available()
        filters = JobFilters(data=self.request.query_params.dict())
        filters.is_valid(raise_exception=True)
        return filters.apply(queryset)

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
