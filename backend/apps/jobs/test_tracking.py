from rest_framework.test import APITestCase
from apps.accounts.test_career_api import candidate
from .testing import submitted_application
from .tests import create_company, create_job


class CandidateTrackingTests(APITestCase):
    def setUp(self):
        self.user = candidate("tracking@example.com")
        self.other = candidate("other-tracking@example.com")
        self.job = create_job(create_company(), application_mode="native", apply_url="")
        self.application = submitted_application(self.user, self.job)
        self.client.force_authenticate(self.user)

    def test_filters_are_owner_scoped_and_validated(self):
        response = self.client.get("/api/applications/", {"status": "submitted", "job_id": self.job.pk})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(self.client.get("/api/applications/", {"status": "invalid"}).status_code, 400)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get("/api/applications/").data, [])

    def test_withdrawal_is_idempotent_and_preserves_submitted_content(self):
        path = f"/api/applications/{self.application.pk}/withdraw/"
        before = self.application.snapshot
        self.assertEqual(self.client.post(path, {}, format="json").status_code, 200)
        self.assertEqual(self.client.post(path, {}, format="json").status_code, 200)
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, "withdrawn")
        self.assertEqual(self.application.snapshot, before)
        self.assertEqual(self.application.events.filter(status="withdrawn").count(), 1)

    def test_other_candidate_cannot_withdraw_and_terminal_status_is_preserved(self):
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post(f"/api/applications/{self.application.pk}/withdraw/", {}, format="json").status_code, 404)
        self.client.force_authenticate(self.user)
        self.application.status = "hired"
        self.application.save()
        self.assertEqual(self.client.post(f"/api/applications/{self.application.pk}/withdraw/", {}, format="json").status_code, 400)
