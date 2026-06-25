from django.contrib import admin

from apps.companies.models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "stage", "company_size", "industry", "is_verified", "is_premium_partner", "updated_at")
    list_filter = ("stage", "company_size", "industry", "is_verified", "is_premium_partner")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "industry", "location", "headquarters")
    readonly_fields = ("created_at", "updated_at")
