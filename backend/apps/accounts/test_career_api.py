from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from .models import AccountState, ApplicantProfile, Experience


def candidate(email):
    user = get_user_model().objects.create_user(username=email, email=email, password="Local-Pass-42")
    AccountState.objects.create(user=user, role="candidate", email_verified=True, verified_email=email)
    ApplicantProfile.objects.create(user=user)
    return user


class CareerApiTests(APITestCase):
    def setUp(self):
        self.user = candidate("owner@example.com")
        self.other = candidate("other@example.com")
        self.client.force_authenticate(self.user)

    def test_profile_updates_are_owned_and_identity_fields_are_protected(self):
        response = self.client.patch("/api/me/profile/", {"headline": "Backend engineer", "skills": ["Python"], "email": "changed@example.com", "user": self.other.pk, "full_name": "Updated Name"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "owner@example.com")
        self.assertEqual(self.user.first_name, "Updated Name")
        self.assertEqual(self.other.applicant_profile.headline, "")
        self.assertEqual(self.client.patch("/api/me/profile/", {"skills": {"admin": True}}, format="json").status_code, 400)

    def test_other_candidates_career_records_cannot_be_seen_or_changed(self):
        record = Experience.objects.create(profile=self.other.applicant_profile, company="Sample", title="Developer", start_date="2020-01-01")
        self.assertEqual(self.client.get(f"/api/me/experience/{record.pk}/").status_code, 404)
        self.assertEqual(self.client.patch(f"/api/me/experience/{record.pk}/", {"title": "Changed"}, format="json").status_code, 404)
        self.assertEqual(self.client.delete(f"/api/me/experience/{record.pk}/").status_code, 404)

    def test_record_validation_and_owner_injection(self):
        response = self.client.post("/api/me/experience/", {"profile": self.other.applicant_profile.pk, "company": "Example", "title": "Developer", "start_date": "2020-01-01", "end_date": "2019-01-01"}, format="json")
        self.assertEqual(response.status_code, 400)
        response = self.client.post("/api/me/experience/", {"profile": self.other.applicant_profile.pk, "company": "Example", "title": "Developer", "start_date": "2020-01-01"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Experience.objects.get().profile.user_id, self.user.pk)

    def test_recruiters_and_anonymous_users_cannot_edit_candidate_profiles(self):
        self.user.account_state.role = "recruiter"
        self.user.account_state.save()
        self.assertEqual(self.client.get("/api/me/profile/").status_code, 403)
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get("/api/me/profile/").status_code, 403)
