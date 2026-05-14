from django.contrib import admin
from .models import WaitlistLead


@admin.register(WaitlistLead)
class WaitlistLeadAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "current_status", "interest", "source", "created_at")
    list_filter = ("current_status", "interest", "source", "created_at")
    search_fields = ("full_name", "email", "phone")
    readonly_fields = ("id", "created_at")
