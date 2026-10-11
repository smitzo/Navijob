from django.db.models import Case, F, IntegerField, Q, When
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from .models import Job


class JobPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 24


class JobFilters(serializers.Serializer):
    q = serializers.CharField(max_length=160, required=False, allow_blank=True)
    location = serializers.CharField(max_length=160, required=False, allow_blank=True)
    skill = serializers.CharField(max_length=60, required=False, allow_blank=True)
    work_mode = serializers.ChoiceField(choices=Job.WorkMode.choices, required=False)
    job_type = serializers.ChoiceField(choices=Job.JobType.choices, required=False)
    seniority = serializers.ChoiceField(choices=Job.Seniority.choices, required=False)
    experience = serializers.IntegerField(min_value=0, max_value=60, required=False)
    salary_min = serializers.IntegerField(min_value=0, max_value=100000000, required=False)
    ordering = serializers.ChoiceField(choices=["newest", "salary"], default="newest")
    is_premium = serializers.BooleanField(required=False)

    def apply(self, queryset):
        values = self.validated_data
        if values.get("q"):
            query = values["q"]
            queryset = queryset.filter(Q(title__icontains=query) | Q(company__name__icontains=query) | Q(description__icontains=query) | Q(skills__icontains=query))
        for field in ("work_mode", "job_type", "seniority", "is_premium"):
            if field in values:
                queryset = queryset.filter(**{field: values[field]})
        if values.get("location"):
            queryset = queryset.filter(location__icontains=values["location"])
        if values.get("skill"):
            queryset = queryset.filter(skills__icontains=values["skill"])
        if "experience" in values:
            queryset = queryset.filter(experience_min__lte=values["experience"]).filter(Q(experience_max__isnull=True) | Q(experience_max__gte=values["experience"]))
        queryset = queryset.annotate(annual_inr=Case(When(currency="INR", salary_period="year", then=F("salary_min")), When(currency="INR", salary_period="month", then=F("salary_min") * 12), default=None, output_field=IntegerField()))
        if "salary_min" in values:
            queryset = queryset.filter(annual_inr__gte=values["salary_min"])
        if values["ordering"] == "salary":
            return queryset.order_by(F("annual_inr").desc(nulls_last=True), "-published_at", "-pk")
        return queryset.order_by("-published_at", "-pk")
