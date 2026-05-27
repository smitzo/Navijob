from rest_framework import serializers

from apps.companies.models import Company


class CompanySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            "id",
            "name",
            "slug",
            "logo_url",
            "industry",
            "stage",
            "company_size",
            "location",
            "is_verified",
            "is_premium_partner",
        )


class CompanyDetailSerializer(CompanySummarySerializer):
    class Meta(CompanySummarySerializer.Meta):
        fields = CompanySummarySerializer.Meta.fields + (
            "website",
            "description",
            "funding_summary",
            "headquarters",
            "careers_url",
            "created_at",
            "updated_at",
        )
