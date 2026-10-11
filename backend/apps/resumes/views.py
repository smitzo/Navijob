from pathlib import PurePosixPath
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from apps.accounts.permissions import IsCandidate
from .models import Resume
from .serializers import ResumeSerializer


class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsCandidate]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    @transaction.atomic
    def perform_create(self, serializer):
        get_user_model().objects.select_for_update().get(pk=self.request.user.pk)
        if self.get_queryset().count() >= 4:
            raise ValidationError("You can keep up to four resume versions. Remove one before uploading another.")
        upload = serializer.validated_data["pdf_file"]
        filename = PurePosixPath(upload.name.replace("\\", "/")).name[:255]
        serializer.save(user=self.request.user, original_filename=filename, file_size=upload.size)
