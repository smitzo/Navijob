from rest_framework.test import APITestCase
from apps.jobs.tests import create_company, create_job
from apps.jobs.models import Job
from .models import Company


class PublicCompanyTests(APITestCase):
    def test_pending_companies_and_draft_roles_are_not_public(self):
        private = Company.objects.create(name="Pending company", slug="pending")
        self.assertEqual(self.client.get(f"/api/companies/{private.slug}/").status_code, 404)
        company = create_company()
        create_job(company, slug="open")
        create_job(company, slug="draft", status=Job.Status.DRAFT)
        create_job(company, slug="closed", status=Job.Status.CLOSED)
        response = self.client.get(f"/api/companies/{company.slug}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([job["slug"] for job in response.data["jobs"]], ["open"])

    def test_company_identity_label_does_not_expose_recruiter_profiles(self):
        company = create_company()
        response = self.client.get(f"/api/companies/{company.slug}/")
        self.assertTrue(response.data["is_verified"])
        self.assertNotIn("recruiters", response.data)
        self.assertEqual(self.client.post("/api/companies/", {"name": "Unauthorized"}, format="json").status_code, 405)
