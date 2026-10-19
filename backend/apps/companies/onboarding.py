from urllib.parse import urlsplit
from uuid import uuid4
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.models import RecruiterProfile
from apps.accounts.permissions import IsRecruiter
from .models import Company
from .serializers import CompanyDetailSerializer


class CompanySetupSerializer(serializers.ModelSerializer):
    recruiter_title = serializers.CharField(max_length=160, required=False, allow_blank=True, write_only=True)
    declaration = serializers.BooleanField(write_only=True, required=False)

    class Meta:
        model = Company
        fields = ("name", "website", "description", "industry", "stage", "company_size", "headquarters", "location", "careers_url", "recruiter_title", "declaration")

    def validate(self, attrs):
        for field in ("website", "careers_url"):
            if attrs.get(field) and urlsplit(attrs[field]).scheme not in {"http", "https"}:
                raise serializers.ValidationError({field: "Use an http or https URL."})
        return attrs


def onboarding_payload(recruiter):
    if recruiter is None:
        return {"company": None, "recruiter": None}
    company = dict(CompanyDetailSerializer(recruiter.company).data)
    company.update(review_status=recruiter.company.review_status, review_feedback=recruiter.company.review_feedback)
    return {"company": company, "recruiter": {"title": recruiter.title, "is_verified": recruiter.is_verified, "can_manage_company": recruiter.can_manage_company}}


class CompanyOnboardingView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request):
        return Response(onboarding_payload(RecruiterProfile.objects.filter(user=request.user).select_related("company").first()))

    @transaction.atomic
    def post(self, request):
        request.user.__class__.objects.select_for_update().get(pk=request.user.pk)
        if RecruiterProfile.objects.filter(user=request.user).exists():
            return Response({"detail": "Your company is already set up. Update its details instead."}, status=409)
        serializer = CompanySetupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        values = serializer.validated_data
        if not values.pop("declaration", False):
            raise ValidationError("Confirm that you represent this company or have permission to hire for it.")
        title = values.pop("recruiter_title", "")
        slug = f"{slugify(values['name'])[:180] or 'company'}-{uuid4().hex[:10]}"
        company = Company.objects.create(slug=slug, **values)
        recruiter = RecruiterProfile.objects.create(user=request.user, company=company, title=title, can_manage_company=True, authority_declaration_at=timezone.now())
        return Response(onboarding_payload(recruiter), status=201)

    @transaction.atomic
    def patch(self, request):
        recruiter = RecruiterProfile.objects.select_related("company").filter(user=request.user).first()
        if not recruiter or not recruiter.can_manage_company:
            raise PermissionDenied("Only an authorized company manager can update these details.")
        company = Company.objects.select_for_update().get(pk=recruiter.company_id)
        serializer = CompanySetupSerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        values = serializer.validated_data
        if company.is_verified:
            for field in ("name", "website"):
                if field in values and values[field] != getattr(company, field):
                    raise ValidationError({field: "Ask the review team to change a reviewed company identity."})
        values.pop("declaration", None)
        title = values.pop("recruiter_title", None)
        serializer.save()
        if title is not None:
            recruiter.title = title
            recruiter.save(update_fields=["title", "updated_at"])
        recruiter.company = company
        return Response(onboarding_payload(recruiter))
