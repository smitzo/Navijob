from rest_framework import viewsets

from apps.jobs.models import Job
from apps.jobs.serializers import JobDetailSerializer, JobListSerializer
from apps.jobs.filters import JobFilters, JobPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.accounts.permissions import IsCandidate
from apps.jobs.applications import application_review


class PublicJobViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    pagination_class = JobPagination

    @action(detail=True, methods=["get"], url_path="application-preview", permission_classes=[IsCandidate])
    def application_preview(self, request, slug=None):
        try:
            resume_id = int(request.query_params.get("resume_id", ""))
        except (ValueError, TypeError) as error:
            raise ValidationError("Choose a resume before reviewing the application.") from error
        return Response(application_review(request.user, self.get_object(), resume_id))

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

