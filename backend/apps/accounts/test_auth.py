from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from rest_framework.test import APITestCase, APIClient

from .models import AccountState

User = get_user_model()


class RegistrationTests(APITestCase):
    def setUp(self):
        cache.clear()

    def payload(self, **changes):
        data = {"email": "candidate@example.com", "name": "Sample Candidate", "password": "Local-Hiring-Pass-42", "role": "candidate"}
        data.update(changes)
        return data

    def test_candidate_signup_is_private_and_unverified(self):
        response = self.client.post("/api/auth/signup/", self.payload(), format="json")
        self.assertEqual(response.status_code, 201)
        state = AccountState.objects.get()
        self.assertFalse(state.email_verified)
        self.assertEqual(state.role, "candidate")
        self.assertTrue(hasattr(state.user, "applicant_profile"))
        self.assertNotIn("password", response.data)
        self.assertEqual(len(mail.outbox), 1)
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_admin_roles_and_weak_passwords_are_rejected(self):
        self.assertEqual(self.client.post("/api/auth/signup/", self.payload(role="admin"), format="json").status_code, 400)
        self.assertEqual(self.client.post("/api/auth/signup/", self.payload(password="1234567890"), format="json").status_code, 400)
        self.assertFalse(User.objects.exists())

    def test_case_insensitive_email_duplicate_is_rejected(self):
        self.client.post("/api/auth/signup/", self.payload(), format="json")
        response = self.client.post("/api/auth/signup/", self.payload(email="CANDIDATE@example.com"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 1)

    def test_anonymous_signup_requires_csrf(self):
        client = APIClient(enforce_csrf_checks=True)
        self.assertEqual(client.post("/api/auth/signup/", self.payload(), format="json").status_code, 403)
        token = client.get("/api/auth/csrf/").json()["csrfToken"]
        self.assertEqual(client.post("/api/auth/signup/", self.payload(), format="json", HTTP_X_CSRFTOKEN=token).status_code, 201)
