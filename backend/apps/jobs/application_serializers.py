from rest_framework import serializers
from .models import ApplicationEvent, JobApplication
from .serializers import JobListSerializer


class SubmitApplicationSerializer(serializers.Serializer):
    job_id = serializers.IntegerField(min_value=1)
    resume = serializers.IntegerField(min_value=1)
    review_token = serializers.CharField(max_length=4096)
    consent = serializers.BooleanField()
    cover_letter = serializers.CharField(max_length=5000, required=False, allow_blank=True)
    answers = serializers.DictField(child=serializers.CharField(max_length=4000, allow_blank=True), required=False, default=dict)

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError("Confirm that you reviewed what will be shared.")
        return value


class ApplicationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationEvent
        fields = ("id", "status", "note", "created_at")


class ApplicationSerializer(serializers.ModelSerializer):
    job = serializers.SerializerMethodField()
    events = ApplicationEventSerializer(many=True, read_only=True)
    resume_download_url = serializers.SerializerMethodField()

    def get_job(self, application):
        return application.snapshot.get("job") or JobListSerializer(application.job).data

    def get_resume_download_url(self, application):
        return f"/api/applications/{application.pk}/resume/" if application.resume_snapshot_file else None

    class Meta:
        model = JobApplication
        fields = ("id", "job", "status", "snapshot", "cover_letter", "answers", "submitted_at", "reviewed_at", "created_at", "events", "resume_download_url")
        read_only_fields = fields
