from django.contrib import admin

from apps.accounts.models import ApplicantProfile, RecruiterProfile


@admin.register(ApplicantProfile)
class ApplicantProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "headline", "location", "preferred_work_mode", "is_open_to_work", "updated_at")
    list_filter = ("is_open_to_work", "preferred_work_mode")
    search_fields = ("user__email", "user__first_name", "user__last_name", "headline", "skills")
    readonly_fields = ("created_at", "updated_at")


@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "company", "title", "can_manage_company", "is_verified", "updated_at")
    list_filter = ("is_verified", "can_manage_company", "company")
    search_fields = ("user__email", "user__first_name", "user__last_name", "company__name", "title")
    readonly_fields = ("created_at", "updated_at")
