from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APITestCase, APIClient
from .models import AccountState

User = get_user_model()


class SessionTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(username="person@example.com", email="person@example.com", password="Local-Password-42")
        self.state = AccountState.objects.create(user=self.user, role="candidate", email_verified=True, verified_email=self.user.email)

    def test_real_session_sets_server_cookie_and_logs_out(self):
        response = self.client.post("/api/auth/login/", {"email": self.user.email, "password": "Local-Password-42"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("sessionid", response.cookies)
        self.assertTrue(response.cookies["sessionid"]["httponly"])
        self.assertEqual(self.client.get("/api/auth/session/").data["user"]["role"], "candidate")
        self.assertEqual(self.client.get("/api/auth/logout/").status_code, 405)
        self.client.post("/api/auth/logout/", {}, format="json")
        self.assertIsNone(self.client.get("/api/auth/session/").data["user"])

    def test_unconfirmed_and_invalid_password_cannot_sign_in(self):
        self.state.email_verified = False
        self.state.save()
        self.assertEqual(self.client.post("/api/auth/login/", {"email": self.user.email, "password": "Local-Password-42"}, format="json").status_code, 403)
        self.assertEqual(self.client.post("/api/auth/login/", {"email": self.user.email, "password": "incorrect"}, format="json").status_code, 400)

    def test_local_demo_credentials_are_not_authentication(self):
        self.assertIsNone(self.client.get("/api/auth/session/", HTTP_AUTHORIZATION="Bearer demo").data["user"])
        self.assertEqual(self.client.post("/api/auth/login/", {"email": "demo", "password": "demo"}, format="json").status_code, 400)

    def test_login_requires_csrf(self):
        client = APIClient(enforce_csrf_checks=True)
        self.assertEqual(client.post("/api/auth/login/", {"email": self.user.email, "password": "Local-Password-42"}, format="json").status_code, 403)
        token = client.get("/api/auth/csrf/").json()["csrfToken"]
        self.assertEqual(client.post("/api/auth/login/", {"email": self.user.email, "password": "Local-Password-42"}, format="json", HTTP_X_CSRFTOKEN=token).status_code, 200)
