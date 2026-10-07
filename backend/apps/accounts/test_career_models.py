from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from .models import ApplicantProfile, Education, Experience


class CareerModelTests(TestCase):
    def setUp(self):
        user = get_user_model().objects.create_user(username="career@example.com")
        self.profile = ApplicantProfile.objects.create(user=user)

    def test_profile_is_private_by_default(self):
        self.assertFalse(self.profile.public_visibility)

    def test_experience_rejects_reversed_and_future_dates(self):
        for start, end, current in [(date(2020, 1, 1), date(2019, 1, 1), False), (timezone.localdate() + timedelta(days=1), None, True), (date(2020, 1, 1), date(2021, 1, 1), True)]:
            with self.assertRaises(ValidationError):
                Experience(profile=self.profile, title="Developer", company="Sample", start_date=start, end_date=end, is_current=current).full_clean()

    def test_education_allows_expected_graduation_and_rejects_reversed_years(self):
        Education(profile=self.profile, institution="Example College", qualification="BSc", start_year=2023, end_year=timezone.localdate().year + 1, is_current=True).full_clean()
        with self.assertRaises(ValidationError):
            Education(profile=self.profile, institution="Example College", qualification="BSc", start_year=2023, end_year=2022).full_clean()
