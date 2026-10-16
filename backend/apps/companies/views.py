from django.db.models import Q
from rest_framework import permissions, serializers, viewsets
from apps.jobs.serializers import JobListSerializer
from .models import Company
from .serializers import CompanyDetailSerializer, CompanySummarySerializer


class PublicCompanyDetailSerializer(CompanyDetailSerializer):
    jobs = serializers.SerializerMethodField()

    def get_jobs(self, company):
        return JobListSerializer(company.jobs.available().select_related("company").order_by("-published_at", "-pk"), many=True).data

    class Meta(CompanyDetailSerializer.Meta):
        fields = CompanyDetailSerializer.Meta.fields + ("jobs",)


class PublicCompanyViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Company.objects.filter(Q(is_verified=True) | Q(jobs__review_status="approved", jobs__status__in=["published", "closed"])).distinct().order_by("name")

    def get_serializer_class(self):
        return PublicCompanyDetailSerializer if self.action == "retrieve" else CompanySummarySerializer
