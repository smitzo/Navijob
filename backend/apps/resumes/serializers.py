from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    pdf_file = serializers.FileField(write_only=True, max_length=255, required=True)

    class Meta:
        model = Resume
        fields = ("id", "title", "pdf_file", "original_filename", "file_size", "is_primary", "created_at", "updated_at")
        read_only_fields = ("id", "original_filename", "file_size", "is_primary", "created_at", "updated_at")

    def validate_pdf_file(self, upload):
        if upload.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Upload a PDF of 5 MB or less.")
        if not upload.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Only PDF resumes are supported in this release.")
        signature = upload.read(5)
        upload.seek(0)
        if signature != b"%PDF-":
            raise serializers.ValidationError("This file does not have a PDF header.")
        return upload


class ResumeMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ("id", "title", "original_filename", "file_size", "is_primary", "created_at", "updated_at")
        read_only_fields = ("id", "original_filename", "file_size", "is_primary", "created_at", "updated_at")
