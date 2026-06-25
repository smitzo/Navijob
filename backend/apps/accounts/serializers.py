from rest_framework import serializers

from apps.accounts.models import ApplicantProfile, RecruiterProfile
from apps.companies.serializers import CompanySummarySerializer


class ApplicantProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = ApplicantProfile
        fields = (
            "id",
            "email",
            "full_name",
            "headline",
            "current_title",
            "location",
            "experience_years",
            "preferred_work_mode",
            "target_roles",
            "target_locations",
            "skills",
            "portfolio_url",
            "linkedin_url",
            "github_url",
            "is_open_to_work",
            "available_from",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class RecruiterProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    company = CompanySummarySerializer(read_only=True)

    class Meta:
        model = RecruiterProfile
        fields = (
            "id",
            "email",
            "full_name",
            "company",
            "title",
            "linkedin_url",
            "can_manage_company",
            "is_verified",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("can_manage_company", "is_verified", "created_at", "updated_at")
