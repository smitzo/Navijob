import uuid
from django.db import models


class WaitlistLead(models.Model):
    """Schema intentionally matches Supabase table `waitlist_leads`."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=160)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=40, blank=True, null=True)
    current_status = models.CharField(max_length=80, blank=True, null=True)
    interest = models.CharField(max_length=120, blank=True, null=True)
    source = models.CharField(max_length=120, default="landing_page")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "waitlist_leads"
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} <{self.email}>"
