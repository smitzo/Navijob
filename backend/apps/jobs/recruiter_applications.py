from django.db.models import Q
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from apps.accounts.permissions import IsRecruiter
from .application_serializers import ApplicationSerializer
from .applications import application_resume_response
from .models import ApplicationNote, JobApplication
from .recruiter_views import recruiter_for


class NoteSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    def get_author_name(self, note):
        return note.author.get_full_name() if note.author else "Former teammate"

    class Meta:
        model = ApplicationNote
        fields = ("id", "body", "author_name", "created_at")
        read_only_fields = ("id", "author_name", "created_at")


class RecruiterApplicationSerializer(ApplicationSerializer):
    notes = NoteSerializer(source="private_notes", many=True, read_only=True)

    def get_resume_download_url(self, application):
        return f"/api/recruiter/applications/{application.pk}/resume/" if application.resume_snapshot_file else None

    class Meta(ApplicationSerializer.Meta):
        fields = ApplicationSerializer.Meta.fields + ("notes",)


class ApplicationBriefSerializer(ApplicationSerializer):
    candidate = serializers.SerializerMethodField()

    def get_candidate(self, application):
        candidate = application.snapshot.get("candidate", {})
        return {key: candidate.get(key, "") for key in ("full_name", "headline", "location", "skills")}

    class Meta(ApplicationSerializer.Meta):
        fields = ("id", "job", "status", "submitted_at", "candidate")


class ApplicantPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 50


class RecruiterApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsRecruiter]
    pagination_class = ApplicantPagination

    def get_serializer_class(self):
        return ApplicationBriefSerializer if self.action == "list" else RecruiterApplicationSerializer

    def get_queryset(self):
        recruiter = recruiter_for(self.request.user, reviewed=True)
        queryset = JobApplication.objects.filter(job__company_id=recruiter.company_id).select_related("job", "job__company").prefetch_related("events", "private_notes__author")
        if self.action == "list":
            stage = self.request.query_params.get("status")
            if stage:
                if stage not in JobApplication.Status.values:
                    raise ValidationError("Choose a valid application stage.")
                queryset = queryset.filter(status=stage)
            job = self.request.query_params.get("job")
            if job:
                if not job.isdigit() or len(job) > 18:
                    raise ValidationError("Choose a valid role.")
                queryset = queryset.filter(job_id=int(job))
            query = self.request.query_params.get("q", "").strip()
            if len(query) > 160:
                raise ValidationError("Search must be 160 characters or less.")
            if query:
                queryset = queryset.filter(Q(snapshot__candidate__full_name__icontains=query) | Q(snapshot__candidate__headline__icontains=query))
        return queryset

    @action(detail=True, methods=["get"])
    def resume(self, request, pk=None):
        return application_resume_response(self.get_object())

    @action(detail=True, methods=["post"])
    def notes(self, request, pk=None):
        application = self.get_object()
        serializer = NoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = serializer.save(application=application, author=request.user)
        return Response(NoteSerializer(note).data, status=201)
