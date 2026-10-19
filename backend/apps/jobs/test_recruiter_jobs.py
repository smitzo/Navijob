from rest_framework.test import APITestCase
from apps.companies.testing import recruiter
from .models import Job
from .tests import create_job


class RecruiterJobTests(APITestCase):
    def setUp(self):
        self.user = recruiter("manager@example.com")
        self.other = recruiter("other-manager@example.com")
        self.client.force_authenticate(self.user)

    def test_drafts_cannot_self_publish_or_change_company(self):
        response = self.client.post("/api/recruiter/jobs/", {"title": "Backend engineer", "description": "Build useful tools with a collaborative product team.", "location": "Bengaluru", "company": self.other.recruiter_profile.company_id, "status": "published", "is_verified": True, "review_status": "approved"}, format="json")
        self.assertEqual(response.status_code, 201)
        job = Job.objects.get()
        self.assertEqual(job.company_id, self.user.recruiter_profile.company_id)
        self.assertEqual(job.status, "draft")
        self.assertFalse(job.is_verified)
        self.assertEqual(self.client.post(f"/api/recruiter/jobs/{job.pk}/submit-review/", {}, format="json").status_code, 200)
        job.refresh_from_db()
        self.assertIsNotNone(job.review_requested_at)
        self.assertEqual(job.status, "draft")

    def test_other_company_roles_cannot_be_accessed_or_changed(self):
        job = create_job(self.other.recruiter_profile.company)
        for action in ("", "close/", "submit-review/"):
            response = self.client.get(f"/api/recruiter/jobs/{job.pk}/") if not action else self.client.post(f"/api/recruiter/jobs/{job.pk}/{action}", {}, format="json")
            self.assertEqual(response.status_code, 404)
        self.assertEqual(self.client.patch(f"/api/recruiter/jobs/{job.pk}/", {"title": "Changed"}, format="json").status_code, 404)

    def test_editing_published_role_requires_another_publication_review(self):
        job = create_job(self.user.recruiter_profile.company)
        response = self.client.patch(f"/api/recruiter/jobs/{job.pk}/", {"title": "Updated role"}, format="json")
        self.assertEqual(response.status_code, 200)
        job.refresh_from_db()
        self.assertEqual(job.status, "draft")
        self.assertEqual(job.review_status, "pending")
        self.assertEqual(self.client.get(f"/api/jobs/{job.slug}/").status_code, 404)

    def test_unreviewed_recruiter_can_draft_but_cannot_request_publication(self):
        self.user.recruiter_profile.is_verified = False
        self.user.recruiter_profile.save()
        job = create_job(self.user.recruiter_profile.company, status="draft")
        self.assertEqual(self.client.post(f"/api/recruiter/jobs/{job.pk}/submit-review/", {}, format="json").status_code, 403)
