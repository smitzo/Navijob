from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsCandidate
from .application_serializers import ApplicationSerializer, SubmitApplicationSerializer
from .applications import application_resume_response, submit_application
from .models import JobApplication


class JobApplicationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsCandidate]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(applicant__user=self.request.user).select_related("job", "job__company").prefetch_related("events")

    def create(self, request, *args, **kwargs):
        serializer = SubmitApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = submit_application(request.user, serializer.validated_data)
        return Response(self.get_serializer(application).data, status=201)

    @action(detail=True, methods=["get"])
    def resume(self, request, pk=None):
        return application_resume_response(self.get_object())
