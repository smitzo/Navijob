from django.db import transaction
from rest_framework import mixins, serializers, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from apps.accounts.models import ApplicantProfile
from apps.accounts.permissions import IsCandidate
from .models import Job, SavedJob
from .serializers import JobListSerializer


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(source="job", write_only=True, queryset=Job.objects.filter(review_status="approved", status__in=["published", "closed"]))

    class Meta:
        model = SavedJob
        fields = ("id", "job", "job_id", "created_at")
        read_only_fields = ("id", "created_at")


class SavedJobViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsCandidate]
    serializer_class = SavedJobSerializer

    def get_queryset(self):
        query = SavedJob.objects.filter(applicant__user=self.request.user).select_related("job", "job__company")
        if self.action == "list":
            query = query.filter(job__review_status="approved", job__status__in=["published", "closed"])
            if self.request.query_params.get("job_id"):
                try:
                    job_id = int(self.request.query_params["job_id"])
                except (ValueError, TypeError) as error:
                    raise ValidationError("Invalid job ID.") from error
                query = query.filter(job_id=job_id)
        return query

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        applicant = ApplicantProfile.objects.select_for_update().get(user=request.user)
        existing = SavedJob.objects.filter(applicant=applicant, job=serializer.validated_data["job"]).first()
        if existing:
            return Response(self.get_serializer(existing).data)
        if SavedJob.objects.filter(applicant=applicant).count() >= 200:
            raise ValidationError("Keep up to 200 saved roles. Remove an older one to add another.")
        saved = serializer.save(applicant=applicant)
        return Response(self.get_serializer(saved).data, status=201)
