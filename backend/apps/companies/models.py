from django.db import models
from apps.core.models import TimeStampedModel


class Company(TimeStampedModel):
    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=220, unique=True)
    website = models.URLField(blank=True)
    logo_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    industry = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=160, blank=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        db_table = "companies"
        ordering = ["name"]

    def __str__(self):
        return self.name
