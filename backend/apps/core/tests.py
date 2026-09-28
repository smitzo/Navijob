from django.test import Client, TestCase


class InfrastructureTests(TestCase):
    def test_health_is_read_only(self):
        self.assertEqual(self.client.get("/api/health/").json()["status"], "ok")
        self.assertEqual(self.client.post("/api/health/").status_code, 405)

    def test_csrf_bootstrap_returns_masked_token_and_cookie(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/auth/csrf/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["csrfToken"])
        self.assertIn("csrftoken", response.cookies)
