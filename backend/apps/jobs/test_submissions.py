from rest_framework.test import APITestCase
from apps.accounts.test_career_api import candidate
from apps.resumes.models import Resume
from apps.resumes.tests import pdf
from .models import JobApplication
from .tests import create_company, create_job


class NativeSubmissionTests(APITestCase):
    def setUp(self):
        self.user = candidate("native@example.com")
        self.other = candidate("other-native@example.com")
        profile = self.user.applicant_profile
        profile.headline = "Backend engineer"
        profile.location = "Bengaluru"
        profile.save()
        self.job = create_job(create_company(), application_mode="native", apply_url="")
        self.client.force_authenticate(self.user)
        response = self.client.post("/api/resumes/", {"title": "Backend roles", "pdf_file": pdf()}, format="multipart")
        self.resume_id = response.data["id"]

    def review(self):
        response = self.client.get(f"/api/jobs/{self.job.slug}/application-preview/", {"resume_id": self.resume_id})
        self.assertEqual(response.status_code, 200)
        return response.data

    def submit(self, **changes):
        values = {"job_id": self.job.pk, "resume": self.resume_id, "review_token": self.review()["review_token"], "consent": True}
        values.update(changes)
        return self.client.post("/api/applications/", values, format="json")

    def test_submission_freezes_profile_and_resume_after_source_changes(self):
        response = self.submit(cover_letter="My contribution", applicant=self.other.applicant_profile.pk, source="forged")
        self.assertEqual(response.status_code, 201)
        application = JobApplication.objects.get()
        self.assertEqual(application.applicant.user_id, self.user.pk)
        self.assertEqual(application.source, "navijob")
        self.user.applicant_profile.headline = "Changed later"
        self.user.applicant_profile.save()
        self.client.delete(f"/api/resumes/{self.resume_id}/")
        application.refresh_from_db()
        self.assertEqual(application.snapshot["candidate"]["headline"], "Backend engineer")
        downloaded = self.client.get(f"/api/applications/{application.pk}/resume/")
        self.assertEqual(downloaded.status_code, 200)
        self.assertTrue(b"".join(downloaded.streaming_content).startswith(b"%PDF-"))
        self.assertEqual(application.events.count(), 1)

    def test_duplicate_submissions_return_existing_receipt(self):
        self.assertEqual(self.submit().status_code, 201)
        response = self.submit()
        self.assertEqual(response.status_code, 409)
        self.assertEqual(int(response.data["application_id"]), JobApplication.objects.get().pk)
        self.assertEqual(JobApplication.objects.count(), 1)

    def test_changed_review_cannot_send_unreviewed_profile_data(self):
        token = self.review()["review_token"]
        profile = self.user.applicant_profile
        profile.headline = "A changed profile"
        profile.save()
        response = self.client.post("/api/applications/", {"job_id": self.job.pk, "resume": self.resume_id, "review_token": token, "consent": True}, format="json")
        self.assertEqual(response.status_code, 409)
        self.assertFalse(JobApplication.objects.exists())

    def test_wrong_owner_resume_and_missing_consent_are_rejected(self):
        other_resume = Resume.objects.create(user=self.other)
        self.assertEqual(self.submit(resume=other_resume.pk).status_code, 400)
        self.assertEqual(self.submit(consent=False).status_code, 400)
        self.assertFalse(JobApplication.objects.exists())

    def test_questions_are_required_and_unknown_answers_rejected(self):
        self.job.application_questions = [{"id": "contribution", "label": "What would you build?", "required": True}]
        self.job.save()
        self.assertEqual(self.submit().status_code, 400)
        self.assertEqual(self.submit(answers={"forged": "Answer"}).status_code, 400)
        self.assertEqual(self.submit(answers={"contribution": "Useful products"}).status_code, 201)

    def test_external_and_closed_roles_do_not_accept_native_submissions(self):
        token = self.review()["review_token"]
        self.job.status = "closed"
        self.job.save()
        payload = {"job_id": self.job.pk, "resume": self.resume_id, "review_token": token, "consent": True}
        self.assertEqual(self.client.post("/api/applications/", payload, format="json").status_code, 400)
        self.job.status = "published"
        self.job.application_mode = "external"
        self.job.apply_url = "https://example.com/apply"
        self.job.save()
        self.assertEqual(self.client.post("/api/applications/", payload, format="json").status_code, 400)

    def test_submitted_applications_are_private_and_cannot_be_rewritten(self):
        response = self.submit()
        self.assertEqual(response.status_code, 201)
        path = f"/api/applications/{response.data['id']}/"
        self.assertEqual(self.client.patch(path, {"cover_letter": "Changed"}, format="json").status_code, 405)
        self.assertEqual(self.client.delete(path).status_code, 405)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(path).status_code, 404)
        self.assertEqual(self.client.get(path + "resume/").status_code, 404)
        self.assertEqual(self.client.get("/api/applications/").data, [])
