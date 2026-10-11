from datetime import timedelta
from django.utils import timezone
from rest_framework.test import APITestCase
from .models import Job
from .tests import create_company, create_job
from django.contrib.auth import get_user_model
from apps.accounts.models import RecruiterProfile


class DiscoveryTests(APITestCase):
    def setUp(self):
        self.company = create_company()

    def test_expired_deadline_and_unreviewed_roles_are_hidden(self):
        create_job(self.company, slug="visible")
        create_job(self.company, slug="unreviewed", review_status=Job.ReviewStatus.PENDING)
        create_job(self.company, slug="expired", expires_at=timezone.now() - timedelta(days=1))
        create_job(self.company, slug="deadline", application_deadline=timezone.localdate() - timedelta(days=1))
        self.assertEqual(self.client.get("/api/jobs/").data["count"], 1)

    def test_closed_roles_keep_readable_details_but_cannot_accept(self):
        job = create_job(self.company, status=Job.Status.CLOSED)
        response = self.client.get(f"/api/jobs/{job.slug}/")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["accepting_applications"])

    def test_optional_premium_filter_does_not_hide_roles_by_default(self):
        create_job(self.company, slug="flagged", is_premium=True)
        create_job(self.company, slug="ordinary", is_premium=False)
        self.assertEqual(self.client.get("/api/jobs/").data["count"], 2)
        self.assertEqual(self.client.get("/api/jobs/", {"is_premium": "false"}).data["count"], 1)

    def test_public_role_does_not_expose_recruiter_email(self):
        user = get_user_model().objects.create_user(username="private-recruiter", email="private@example.com", first_name="Recruiter")
        recruiter = RecruiterProfile.objects.create(user=user, company=self.company)
        job = create_job(self.company, posted_by=recruiter)
        response = self.client.get(f"/api/jobs/{job.slug}/")
        self.assertNotIn("email", response.data["posted_by"])
        self.assertNotIn("phone", response.data["posted_by"])

    def test_salary_comparison_uses_annual_inr_and_excludes_unknown_rates(self):
        create_job(self.company, slug="year", currency="INR", salary_min=1200000, salary_max=1800000)
        create_job(self.company, slug="month", currency="INR", salary_period="month", salary_min=150000, salary_max=180000)
        create_job(self.company, slug="usd", currency="USD", salary_min=9000000, salary_max=9900000)
        response = self.client.get("/api/jobs/", {"salary_min": 1300000, "ordering": "salary"})
        self.assertEqual([job["slug"] for job in response.data["results"]], ["month"])

    def test_invalid_filters_and_page_sizes_are_bounded(self):
        self.assertEqual(self.client.get("/api/jobs/", {"experience": -1}).status_code, 400)
        self.assertEqual(self.client.get("/api/jobs/", {"work_mode": "unknown"}).status_code, 400)
        for index in range(25):
            create_job(self.company, slug=f"role-{index}")
        self.assertEqual(len(self.client.get("/api/jobs/", {"page_size": 1000}).data["results"]), 24)
