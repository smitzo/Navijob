from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from apps.accounts.permissions import IsCandidate
from .application_serializers import ApplicationSerializer, SubmitApplicationSerializer
from .applications import application_resume_response, submit_application
from .models import ApplicationEvent, JobApplication


class JobApplicationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsCandidate]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        queryset = JobApplication.objects.filter(applicant__user=self.request.user).select_related("job", "job__company").prefetch_related("events")
        if self.action == "list":
            status = self.request.query_params.get("status")
            if status:
                if status not in JobApplication.Status.values:
                    raise ValidationError("Choose a valid application status.")
                queryset = queryset.filter(status=status)
            job_id = self.request.query_params.get("job_id")
            if job_id:
                if not job_id.isdigit() or len(job_id) > 18:
                    raise ValidationError("Invalid job ID.")
                queryset = queryset.filter(job_id=int(job_id))
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = SubmitApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = submit_application(request.user, serializer.validated_data)
        return Response(self.get_serializer(application).data, status=201)

    @action(detail=True, methods=["get"])
    def resume(self, request, pk=None):
        return application_resume_response(self.get_object())

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def withdraw(self, request, pk=None):
        application = self.get_queryset().select_for_update().get(pk=self.get_object().pk)
        if application.status == "withdrawn":
            return Response(self.get_serializer(application).data)
        if application.status in {"hired", "rejected"}:
            raise ValidationError("This application is already closed and cannot be withdrawn.")
        application.status = "withdrawn"
        application.save(update_fields=["status", "updated_at"])
        ApplicationEvent.objects.create(application=application, actor=request.user, status="withdrawn", note="Candidate withdrew the application.")
        application.refresh_from_db()
        return Response(self.get_serializer(application).data)
