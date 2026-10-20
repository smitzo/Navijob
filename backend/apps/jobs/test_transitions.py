from rest_framework.test import APITestCase
from apps.accounts.test_career_api import candidate
from apps.companies.testing import recruiter
from .testing import submitted_application
from .tests import create_job


class StageTransitionTests(APITestCase):
    def setUp(self):
        self.user = recruiter("stage-reviewer@example.com")
        self.candidate = candidate("stage-candidate@example.com")
        self.job = create_job(self.user.recruiter_profile.company, application_mode="native", apply_url="")
        self.application = submitted_application(self.candidate, self.job)
        self.client.force_authenticate(self.user)
        self.path = f"/api/recruiter/applications/{self.application.pk}/stage/"

    def move(self, status, expected):
        return self.client.post(self.path, {"status": status, "expected_status": expected}, format="json")

    def test_valid_stages_create_history_and_preserve_snapshot(self):
        snapshot = self.application.snapshot
        previous = "submitted"
        for status in ("reviewing", "interview", "offer", "hired"):
            response = self.move(status, previous)
            self.assertEqual(response.status_code, 200)
            previous = status
        self.application.refresh_from_db()
        self.assertEqual(self.application.snapshot, snapshot)
        self.assertEqual(self.application.events.count(), 5)
        self.assertIsNotNone(self.application.reviewed_at)
        self.assertEqual(self.move("reviewing", "hired").status_code, 400)

    def test_invalid_stale_and_duplicate_stage_updates(self):
        self.assertEqual(self.move("hired", "submitted").status_code, 400)
        self.assertEqual(self.move("reviewing", "submitted").status_code, 200)
        self.assertEqual(self.move("reviewing", "submitted").status_code, 200)
        self.assertEqual(self.application.events.filter(status="reviewing").count(), 1)
        self.assertEqual(self.move("interview", "submitted").status_code, 409)

    def test_other_company_and_withdrawn_application_cannot_be_advanced(self):
        other = recruiter("foreign-stage@example.com")
        self.client.force_authenticate(other)
        self.assertEqual(self.move("reviewing", "submitted").status_code, 404)
        self.client.force_authenticate(self.candidate)
        self.client.post(f"/api/applications/{self.application.pk}/withdraw/", {}, format="json")
        self.client.force_authenticate(self.user)
        self.assertEqual(self.move("reviewing", "withdrawn").status_code, 400)
