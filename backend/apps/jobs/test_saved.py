from rest_framework.test import APITestCase
from apps.accounts.test_career_api import candidate
from .tests import create_company, create_job
from .models import Job, SavedJob


class SavedJobTests(APITestCase):
    def setUp(self):
        self.user = candidate("save@example.com")
        self.other = candidate("other-save@example.com")
        self.job = create_job(create_company())
        self.client.force_authenticate(self.user)

    def test_saving_is_idempotent_and_owner_scoped(self):
        first = self.client.post("/api/saved-jobs/", {"job_id": self.job.pk, "applicant": self.other.applicant_profile.pk}, format="json")
        second = self.client.post("/api/saved-jobs/", {"job_id": self.job.pk}, format="json")
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(SavedJob.objects.count(), 1)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get("/api/saved-jobs/").data, [])
        self.assertEqual(self.client.delete(f"/api/saved-jobs/{first.data['id']}/").status_code, 404)

    def test_unpublished_role_is_not_exposed_through_saved_list(self):
        self.client.post("/api/saved-jobs/", {"job_id": self.job.pk}, format="json")
        Job.objects.filter(pk=self.job.pk).update(status="draft", description="Private revision")
        self.assertEqual(self.client.get("/api/saved-jobs/").data, [])
        self.assertEqual(self.client.post("/api/saved-jobs/", {"job_id": self.job.pk}, format="json").status_code, 400)
