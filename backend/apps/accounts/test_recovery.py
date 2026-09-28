from urllib.parse import parse_qs, urlsplit
from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from rest_framework.test import APITestCase


class RecoveryTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(username="reset@example.com", email="reset@example.com", password="Old-Local-Password-42")

    def reset_data(self):
        self.client.post("/api/auth/recovery/", {"email": self.user.email}, format="json")
        link = next(line for line in mail.outbox[-1].body.splitlines() if line.startswith("http"))
        query = parse_qs(urlsplit(link).query)
        return {"uid": query["uid"][0], "token": query["token"][0], "password": "Different-Local-Pass-84"}

    def test_reset_is_single_use_and_changes_credentials(self):
        data = self.reset_data()
        self.assertEqual(self.client.post("/api/auth/reset-password/", data, format="json").status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(data["password"]))
        self.assertEqual(self.client.post("/api/auth/reset-password/", data, format="json").status_code, 400)

    def test_invalid_and_weak_passwords_do_not_reset_account(self):
        data = self.reset_data()
        self.assertEqual(self.client.post("/api/auth/reset-password/", {**data, "password": "1234567890"}, format="json").status_code, 400)
        self.assertEqual(self.client.post("/api/auth/reset-password/", {**data, "token": "invalid"}, format="json").status_code, 400)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Old-Local-Password-42"))

    def test_recovery_does_not_reveal_account_existence(self):
        known = self.client.post("/api/auth/recovery/", {"email": self.user.email}, format="json")
        missing = self.client.post("/api/auth/recovery/", {"email": "missing@example.com"}, format="json")
        self.assertEqual(known.data, missing.data)
        self.assertEqual(len(mail.outbox), 1)
