import copy
from uuid import uuid4
from django.core.exceptions import ValidationError as ModelValidationError
from django.db import transaction
from django.db.models import Count
from django.utils import timezone
from django.utils.text import slugify
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from apps.accounts.models import RecruiterProfile
from apps.accounts.permissions import IsRecruiter
from apps.companies.serializers import CompanySummarySerializer
from .models import Job


def recruiter_for(user, manage=False, reviewed=False):
    recruiter = RecruiterProfile.objects.filter(user=user).select_related("company").first()
    if not recruiter:
        raise PermissionDenied("Complete company setup first.")
    if manage and not recruiter.can_manage_company:
        raise PermissionDenied("A company manager is required for this action.")
    if reviewed and (not recruiter.is_verified or not recruiter.company.is_verified or recruiter.company.review_status != "approved"):
        raise PermissionDenied("Company identity and recruiter authority must be reviewed first.")
    return recruiter


class RecruiterJobSerializer(serializers.ModelSerializer):
    company = CompanySummarySerializer(read_only=True)
    responsibilities = serializers.ListField(child=serializers.CharField(max_length=500), max_length=30, required=False, allow_empty=True)
    requirements = serializers.ListField(child=serializers.CharField(max_length=500), max_length=30, required=False, allow_empty=True)
    benefits = serializers.ListField(child=serializers.CharField(max_length=500), max_length=30, required=False, allow_empty=True)
    skills = serializers.ListField(child=serializers.CharField(max_length=60), max_length=40, required=False, allow_empty=True)
    application_mode = serializers.ChoiceField(choices=Job.ApplicationMode.choices, default="native")
    currency = serializers.ChoiceField(choices=["INR", "USD", "EUR", "GBP"], default="INR")
    applications_count = serializers.IntegerField(read_only=True)
    description = serializers.CharField(max_length=20000)
    experience_min = serializers.IntegerField(min_value=0, max_value=60, required=False)
    experience_max = serializers.IntegerField(min_value=0, max_value=60, required=False, allow_null=True)
    salary_min = serializers.IntegerField(min_value=0, max_value=1000000000, required=False, allow_null=True)
    salary_max = serializers.IntegerField(min_value=0, max_value=1000000000, required=False, allow_null=True)

    class Meta:
        model = Job
        fields = ("id", "slug", "company", "title", "description", "responsibilities", "requirements", "benefits", "skills", "location", "work_mode", "job_type", "seniority", "experience_min", "experience_max", "salary_min", "salary_max", "salary_period", "currency", "application_mode", "apply_url", "application_questions", "application_deadline", "status", "review_status", "review_feedback", "review_requested_at", "applications_count", "created_at", "updated_at")
        read_only_fields = ("id", "slug", "company", "status", "review_status", "review_feedback", "review_requested_at", "applications_count", "created_at", "updated_at")

    def validate(self, attrs):
        probe = copy.copy(self.instance) if self.instance else Job()
        for key, value in attrs.items():
            setattr(probe, key, value)
        try:
            probe.clean()
        except ModelValidationError as error:
            raise serializers.ValidationError(error.message_dict) from error
        return attrs


class RecruiterJobViewSet(viewsets.ModelViewSet):
    permission_classes = [IsRecruiter]
    serializer_class = RecruiterJobSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        recruiter = RecruiterProfile.objects.filter(user=self.request.user).first()
        if not recruiter:
            return Job.objects.none()
        return Job.objects.filter(company_id=recruiter.company_id).select_related("company").annotate(applications_count=Count("applications")).order_by("-updated_at", "-pk")

    def perform_create(self, serializer):
        recruiter = recruiter_for(self.request.user, manage=True)
        slug = f"{slugify(serializer.validated_data['title'])[:210] or 'role'}-{uuid4().hex[:10]}"
        serializer.save(company=recruiter.company, posted_by=recruiter, slug=slug, status="draft", review_status="pending", source="Employer supplied")

    @transaction.atomic
    def perform_update(self, serializer):
        recruiter_for(self.request.user, manage=True)
        serializer.instance = Job.objects.select_for_update().get(pk=serializer.instance.pk)
        try:
            serializer.save(status="draft", review_status="pending", review_requested_at=None, review_feedback="", is_verified=False)
        except ModelValidationError as error:
            raise ValidationError(error.message_dict) from error

    @action(detail=True, methods=["post"], url_path="submit-review")
    @transaction.atomic
    def submit_review(self, request, pk=None):
        recruiter_for(request.user, manage=True, reviewed=True)
        job = Job.objects.select_for_update().get(pk=self.get_object().pk)
        if job.status != "draft":
            raise ValidationError("Only draft roles can be submitted for publication review.")
        if len(job.description.strip()) < 40 or not job.location.strip():
            raise ValidationError("Add a useful description of at least 40 characters and a location before review.")
        if not job.review_requested_at:
            job.review_requested_at = timezone.now()
            job.review_status = "pending"
            job.save(update_fields=["review_requested_at", "review_status", "updated_at"])
        return Response(self.get_serializer(job).data)

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def close(self, request, pk=None):
        recruiter_for(request.user, manage=True)
        job = Job.objects.select_for_update().get(pk=self.get_object().pk)
        job.status = "closed"
        job.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(job).data)
