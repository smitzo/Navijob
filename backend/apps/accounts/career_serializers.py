import copy
from urllib.parse import urlsplit
from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import serializers
from .models import Education, Experience, Project
from .serializers import ApplicantProfileSerializer


class ValidatedCareerSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        probe = copy.copy(self.instance) if self.instance else self.Meta.model()
        for key, value in attrs.items():
            setattr(probe, key, value)
        try:
            probe.clean()
        except ValidationError as error:
            raise serializers.ValidationError(error.message_dict) from error
        return attrs


class ExperienceSerializer(ValidatedCareerSerializer):
    class Meta:
        model = Experience
        fields = ("id", "company", "title", "location", "start_date", "end_date", "is_current", "description")
        read_only_fields = ("id",)


class EducationSerializer(ValidatedCareerSerializer):
    class Meta:
        model = Education
        fields = ("id", "institution", "qualification", "field_of_study", "start_year", "end_year", "is_current", "description")
        read_only_fields = ("id",)


class CareerProfileSerializer(ApplicantProfileSerializer):
    full_name = serializers.CharField(source="user.first_name", max_length=150, min_length=2, required=False)
    skills = serializers.ListField(child=serializers.CharField(max_length=60), max_length=40, allow_empty=True, required=False)
    target_roles = serializers.ListField(child=serializers.CharField(max_length=100), max_length=15, allow_empty=True, required=False)
    target_locations = serializers.ListField(child=serializers.CharField(max_length=100), max_length=20, allow_empty=True, required=False)
    notice_period_days = serializers.IntegerField(min_value=0, max_value=365, required=False)
    experience_years = serializers.IntegerField(min_value=0, max_value=60, required=False)
    experiences = ExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)

    class Meta(ApplicantProfileSerializer.Meta):
        fields = ApplicantProfileSerializer.Meta.fields + ("summary", "phone", "notice_period_days", "public_visibility", "experiences", "education")
        read_only_fields = ("id", "email", "created_at", "updated_at")

    def validate(self, attrs):
        for key in ("portfolio_url", "linkedin_url", "github_url"):
            if attrs.get(key) and urlsplit(attrs[key]).scheme not in {"http", "https"}:
                raise serializers.ValidationError({key: "Use an http or https URL."})
        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        user = validated_data.pop("user", {})
        if "first_name" in user:
            instance.user.first_name = user["first_name"]
            instance.user.last_name = ""
            instance.user.save(update_fields=["first_name", "last_name"])
        return super().update(instance, validated_data)


class ProjectSerializer(ValidatedCareerSerializer):
    stack = serializers.ListField(child=serializers.CharField(max_length=60), max_length=30, allow_empty=True, required=False)
    evidence_status = serializers.CharField(default="candidate_provided", read_only=True)

    class Meta:
        model = Project
        fields = ("id", "title", "description", "contribution", "stage", "stack", "source_url", "demo_url", "evidence_status")
        read_only_fields = ("id", "evidence_status")
