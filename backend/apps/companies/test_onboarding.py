from rest_framework.test import APITestCase
from apps.accounts.models import AccountState
from apps.accounts.test_career_api import candidate
from .models import Company


class CompanyOnboardingTests(APITestCase):
    def setUp(self):
        self.user = candidate("hiring@example.com")
        AccountState.objects.filter(user=self.user).update(role="recruiter")
        self.user.refresh_from_db()
        self.client.force_authenticate(self.user)

    def test_setup_creates_pending_company_without_granting_trust(self):
        response = self.client.post("/api/recruiter/company/", {"name": "Example team", "website": "https://example.com", "declaration": True, "is_verified": True, "company_id": 999}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data["company"]["is_verified"])
        self.assertFalse(response.data["recruiter"]["is_verified"])
        self.assertEqual(response.data["company"]["review_status"], "pending")
        self.assertEqual(self.client.post("/api/recruiter/company/", {"name": "Another", "declaration": True}, format="json").status_code, 409)

    def test_declaration_required_and_candidate_cannot_onboard_company(self):
        self.assertEqual(self.client.post("/api/recruiter/company/", {"name": "Example"}, format="json").status_code, 400)
        AccountState.objects.filter(user=self.user).update(role="candidate")
        self.user.refresh_from_db()
        self.assertEqual(self.client.get("/api/recruiter/company/").status_code, 403)

    def test_review_flags_and_foreign_company_ids_cannot_be_changed(self):
        self.client.post("/api/recruiter/company/", {"name": "Example", "declaration": True}, format="json")
        other = Company.objects.create(name="Other", slug="other-company")
        response = self.client.patch("/api/recruiter/company/", {"description": "Our work", "company_id": other.pk, "is_verified": True, "review_status": "approved"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data["company"]["id"], other.pk)
        self.assertFalse(response.data["company"]["is_verified"])
