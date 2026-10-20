from rest_framework.test import APITestCase
from apps.accounts.test_career_api import candidate
from apps.companies.testing import recruiter
from .testing import submitted_application
from .tests import create_job


class RecruiterApplicationTests(APITestCase):
    def setUp(self):
        self.recruiter = recruiter("reviewer@example.com")
        self.other_recruiter = recruiter("other-reviewer@example.com")
        self.candidate = candidate("applicant@example.com")
        job = create_job(self.recruiter.recruiter_profile.company, application_mode="native", apply_url="")
        self.application = submitted_application(self.candidate, job)
        self.client.force_authenticate(self.recruiter)

    def test_company_scoped_list_and_private_resume_download(self):
        response = self.client.get("/api/recruiter/applications/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertNotIn("snapshot", response.data["results"][0])
        self.assertEqual(self.client.get(f"/api/recruiter/applications/{self.application.pk}/resume/").status_code, 200)
        self.client.force_authenticate(self.other_recruiter)
        self.assertEqual(self.client.get("/api/recruiter/applications/").data["count"], 0)
        self.assertEqual(self.client.get(f"/api/recruiter/applications/{self.application.pk}/").status_code, 404)
        self.assertEqual(self.client.get(f"/api/recruiter/applications/{self.application.pk}/resume/").status_code, 404)

    def test_team_notes_are_not_exposed_to_candidate(self):
        response = self.client.post(f"/api/recruiter/applications/{self.application.pk}/notes/", {"body": "Private team note", "author": self.candidate.pk}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.application.private_notes.get().author_id, self.recruiter.pk)
        self.client.force_authenticate(self.candidate)
        response = self.client.get(f"/api/applications/{self.application.pk}/")
        self.assertNotIn("notes", response.data)
        self.assertNotIn("Private team note", str(response.data))
        self.assertEqual(self.client.post(f"/api/recruiter/applications/{self.application.pk}/notes/", {"body": "Forged"}, format="json").status_code, 403)

    def test_unreviewed_recruiter_cannot_access_applicant_data(self):
        self.recruiter.recruiter_profile.is_verified = False
        self.recruiter.recruiter_profile.save()
        self.assertEqual(self.client.get("/api/recruiter/applications/").status_code, 403)
