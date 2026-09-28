from urllib.parse import parse_qs, urlsplit
from unittest.mock import patch
import time

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from rest_framework.test import APITestCase
from .models import AccountState
from .tokens import send_confirmation


class ConfirmationTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(username="confirm@example.com", email="confirm@example.com", password="Local-Pass-42")
        self.state = AccountState.objects.create(user=self.user, role="candidate")

    def token(self):
        send_confirmation(self.user)
        link = next(line for line in mail.outbox[-1].body.splitlines() if line.startswith("http"))
        return parse_qs(urlsplit(link).query)["token"][0]

    def test_confirmation_sets_only_current_email_and_does_not_sign_in(self):
        response = self.client.post("/api/auth/confirm-email/", {"token": self.token()}, format="json")
        self.assertEqual(response.status_code, 200)
        self.state.refresh_from_db()
        self.assertTrue(self.state.email_verified)
        self.assertEqual(self.state.verified_email, self.user.email)
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_confirmation_rejects_expired_and_changed_account_tokens(self):
        with patch("django.core.signing.time.time", return_value=time.time() - 90000):
            old = self.token()
        self.assertEqual(self.client.post("/api/auth/confirm-email/", {"token": old}, format="json").status_code, 400)
        token = self.token()
        self.user.set_password("Different-Local-Pass-42")
        self.user.save()
        self.assertEqual(self.client.post("/api/auth/confirm-email/", {"token": token}, format="json").status_code, 400)

    def test_resend_is_not_an_account_lookup(self):
        known = self.client.post("/api/auth/resend-confirmation/", {"email": self.user.email}, format="json")
        missing = self.client.post("/api/auth/resend-confirmation/", {"email": "missing@example.com"}, format="json")
        self.assertEqual(known.data, missing.data)
        self.assertEqual(len(mail.outbox), 1)
