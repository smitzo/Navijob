from rest_framework.test import APITestCase
from apps.accounts.test_career_api import candidate
from .models import Resume
from .tests import pdf


class ResumeVersionTests(APITestCase):
    def setUp(self):
        self.user = candidate("versions@example.com")
        self.other = candidate("other-versions@example.com")
        self.client.force_authenticate(self.user)
        self.first = self.client.post("/api/resumes/", {"title": "First", "pdf_file": pdf()}, format="multipart").data["id"]
        self.second = self.client.post("/api/resumes/", {"title": "Second", "pdf_file": pdf()}, format="multipart").data["id"]

    def test_primary_selection_is_unique_and_removal_selects_replacement(self):
        self.assertEqual(self.client.post(f"/api/resumes/{self.second}/make-primary/", {}, format="json").status_code, 200)
        self.assertEqual(list(Resume.objects.filter(user=self.user, is_primary=True).values_list("pk", flat=True)), [self.second])
        self.client.delete(f"/api/resumes/{self.second}/")
        self.assertTrue(Resume.objects.get(pk=self.first).is_primary)

    def test_download_and_rename_are_private_to_owner(self):
        response = self.client.get(f"/api/resumes/{self.first}/download/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(b"".join(response.streaming_content).startswith(b"%PDF-"))
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertEqual(response["Cache-Control"], "private, no-store")
        self.client.force_authenticate(self.other)
        for method in ("get", "patch", "delete"):
            self.assertEqual(getattr(self.client, method)(f"/api/resumes/{self.first}/").status_code, 404)
        self.assertEqual(self.client.get(f"/api/resumes/{self.first}/download/").status_code, 404)

    def test_upload_bytes_cannot_be_replaced_through_metadata_updates(self):
        self.assertEqual(self.client.patch(f"/api/resumes/{self.first}/", {"pdf_file": pdf()}, format="multipart").status_code, 400)
        self.assertEqual(self.client.patch(f"/api/resumes/{self.first}/", {"title": "Backend roles"}, format="json").status_code, 200)
