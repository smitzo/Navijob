from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from apps.accounts.test_career_api import candidate
from .models import Resume


def pdf(name="resume.pdf", content=b"%PDF-1.4\nLocal test resume"):
    return SimpleUploadedFile(name, content, content_type="application/pdf")


class ResumeUploadTests(APITestCase):
    def setUp(self):
        self.user = candidate("resume-owner@example.com")
        self.other = candidate("resume-other@example.com")
        self.client.force_authenticate(self.user)

    def test_four_version_limit_and_private_paths(self):
        for index in range(4):
            response = self.client.post("/api/resumes/", {"title": f"Version {index}", "pdf_file": pdf()}, format="multipart")
            self.assertEqual(response.status_code, 201)
            self.assertNotIn("pdf_file", response.data)
            self.assertNotIn("user", response.data)
        self.assertEqual(self.client.post("/api/resumes/", {"pdf_file": pdf()}, format="multipart").status_code, 400)
        self.assertEqual(Resume.objects.filter(user=self.user).count(), 4)
        self.assertTrue(all(resume.pdf_file.name.startswith(f"resumes/{self.user.pk}/") for resume in Resume.objects.all()))

    def test_non_pdf_and_large_uploads_are_rejected(self):
        for file in (pdf(content=b"not-a-pdf"), pdf(name="resume.exe"), pdf(content=b"%PDF-" + b"x" * (5 * 1024 * 1024))):
            self.assertEqual(self.client.post("/api/resumes/", {"pdf_file": file}, format="multipart").status_code, 400)
        self.assertFalse(Resume.objects.exists())

    def test_listing_is_private_to_owner(self):
        Resume.objects.create(user=self.other, title="Other private resume")
        self.assertEqual(self.client.get("/api/resumes/").data, [])
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get("/api/resumes/").status_code, 403)
