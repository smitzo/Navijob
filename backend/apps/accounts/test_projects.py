from rest_framework.test import APITestCase
from .test_career_api import candidate
from .models import Project


class ProjectTests(APITestCase):
    def setUp(self):
        self.user = candidate("builder@example.com")
        self.other = candidate("another@example.com")
        self.client.force_authenticate(self.user)

    def test_project_evidence_cannot_be_self_marked_verified(self):
        response = self.client.post("/api/me/projects/", {"title": "Portfolio", "description": "A project in progress.", "stage": "prototype", "stack": ["Python"], "evidence_status": "verified", "profile": self.other.applicant_profile.pk}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["evidence_status"], "candidate_provided")
        self.assertEqual(Project.objects.get().profile.user_id, self.user.pk)

    def test_private_projects_are_owner_scoped(self):
        project = Project.objects.create(profile=self.other.applicant_profile, title="Private work", description="Not shared")
        self.assertEqual(self.client.get(f"/api/me/projects/{project.pk}/").status_code, 404)

    def test_invalid_stack_and_unsafe_links_are_rejected(self):
        for values in ({"stack": "Python"}, {"source_url": "ftp://example.com/source"}, {"stage": "verified"}):
            self.assertEqual(self.client.post("/api/me/projects/", {"title": "Project", "description": "Description", **values}, format="json").status_code, 400)
