from django.contrib import admin

from apps.jobs.models import Job, JobApplication


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "status", "seniority", "work_mode", "job_type", "is_premium", "published_at")
    list_filter = ("status", "seniority", "work_mode", "job_type", "is_premium", "is_verified")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "company__name", "location", "skills")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "published_at"


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ("job", "applicant", "status", "source", "submitted_at", "updated_at")
    list_filter = ("status", "source", "submitted_at")
    search_fields = ("job__title", "applicant__user__email", "applicant__user__first_name", "applicant__user__last_name")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "submitted_at"
