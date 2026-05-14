from django.conf import settings
from django.db import models
from apps.core.models import TimeStampedModel


class Payment(TimeStampedModel):
    class Status(models.TextChoices):
        CREATED = "created", "Created"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.PositiveIntegerField(help_text="Amount in smallest currency unit, for example paise.")
    currency = models.CharField(max_length=8, default="INR")
    provider = models.CharField(max_length=40, default="razorpay")
    provider_order_id = models.CharField(max_length=160, blank=True)
    provider_payment_id = models.CharField(max_length=160, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED)

    class Meta:
        db_table = "payments"
        indexes = [models.Index(fields=["provider", "provider_order_id"])]
