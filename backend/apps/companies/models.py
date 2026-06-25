from django.db import models
from apps.core.models import TimeStampedModel


class Company(TimeStampedModel):
    class Stage(models.TextChoices):
        IDEA = "idea", "Idea"
        PRE_SEED = "pre_seed", "Pre-seed"
        SEED = "seed", "Seed"
        SERIES_A = "series_a", "Series A"
        SERIES_B = "series_b", "Series B"
        GROWTH = "growth", "Growth"
        PUBLIC = "public", "Public"

    class CompanySize(models.TextChoices):
        ONE_TO_TEN = "1_10", "1-10"
        ELEVEN_TO_FIFTY = "11_50", "11-50"
        FIFTY_ONE_TO_TWO_HUNDRED = "51_200", "51-200"
        TWO_HUNDRED_ONE_TO_FIVE_HUNDRED = "201_500", "201-500"
        FIVE_HUNDRED_PLUS = "500_plus", "500+"

    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=220, unique=True)
    website = models.URLField(blank=True)
    logo_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    industry = models.CharField(max_length=120, blank=True)
    stage = models.CharField(max_length=20, choices=Stage.choices, blank=True)
    company_size = models.CharField(max_length=20, choices=CompanySize.choices, blank=True)
    funding_summary = models.CharField(max_length=180, blank=True)
    headquarters = models.CharField(max_length=160, blank=True)
    location = models.CharField(max_length=160, blank=True)
    careers_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    is_premium_partner = models.BooleanField(default=False)

    class Meta:
        db_table = "companies"
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_verified", "is_premium_partner"]),
            models.Index(fields=["stage", "industry"]),
        ]
        ordering = ["name"]

    def __str__(self):
        return self.name
