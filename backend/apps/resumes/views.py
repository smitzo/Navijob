from pathlib import PurePosixPath
from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from apps.accounts.permissions import IsCandidate
from .models import Resume
from .serializers import ResumeMetadataSerializer, ResumeSerializer


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsCandidate]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_serializer_class(self):
        return ResumeSerializer if self.action == "create" else ResumeMetadataSerializer

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    @transaction.atomic
    def perform_create(self, serializer):
        get_user_model().objects.select_for_update().get(pk=self.request.user.pk)
        if self.get_queryset().count() >= 4:
            raise ValidationError("You can keep up to four resume versions. Remove one before uploading another.")
        upload = serializer.validated_data["pdf_file"]
        filename = PurePosixPath(upload.name.replace("\\", "/")).name[:255]
        serializer.save(user=self.request.user, original_filename=filename, file_size=upload.size, is_primary=not self.get_queryset().filter(is_primary=True).exists())

    def partial_update(self, request, *args, **kwargs):
        if "pdf_file" in request.data:
            raise ValidationError("Upload a new resume version instead of replacing an existing file.")
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        resume = self.get_object()
        if not resume.pdf_file:
            raise NotFound("This resume has no uploaded PDF.")
        try:
            response = FileResponse(resume.pdf_file.open("rb"), as_attachment=True, filename=resume.original_filename or "resume.pdf", content_type="application/pdf")
        except FileNotFoundError as error:
            raise NotFound("This resume file is unavailable.") from error
        response["Cache-Control"] = "private, no-store"
        return response

    @action(detail=True, methods=["post"], url_path="make-primary")
    @transaction.atomic
    def make_primary(self, request, pk=None):
        get_user_model().objects.select_for_update().get(pk=request.user.pk)
        resume = self.get_object()
        self.get_queryset().filter(is_primary=True).update(is_primary=False)
        resume.is_primary = True
        resume.save(update_fields=["is_primary", "updated_at"])
        return Response(ResumeMetadataSerializer(resume).data)

    @transaction.atomic
    def perform_destroy(self, instance):
        get_user_model().objects.select_for_update().get(pk=self.request.user.pk)
        storage, name, primary = instance.pdf_file.storage, instance.pdf_file.name, instance.is_primary
        instance.delete()
        if name:
            transaction.on_commit(lambda: storage.delete(name))
        if primary:
            replacement = self.get_queryset().first()
            if replacement:
                replacement.is_primary = True
                replacement.save(update_fields=["is_primary", "updated_at"])
