from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from apps.accounts.test_career_api import candidate
from .models import ApplicationEvent, JobApplication
from .tests import create_company, create_job


class SnapshotModelTests(TestCase):
    def setUp(self):
        self.user = candidate("snapshot@example.com")
        self.job = create_job(create_company(), application_mode="native", apply_url="")
        self.application = JobApplication.objects.create(job=self.job, applicant=self.user.applicant_profile, snapshot={"candidate": {"headline": "Original headline"}}, cover_letter="Original cover letter", submitted_at=timezone.now())

    def test_submitted_content_is_immutable(self):
        self.application.snapshot["candidate"]["headline"] = "Changed"
        with self.assertRaises(ValidationError):
            self.application.save()
        self.application.refresh_from_db()
        self.application.cover_letter = "Changed"
        with self.assertRaises(ValidationError):
            self.application.save()

    def test_stage_changes_remain_possible_after_role_closes(self):
        self.job.status = "closed"
        self.job.save()
        self.application.status = "reviewing"
        self.application.save(update_fields=["status", "updated_at"])
        ApplicationEvent.objects.create(application=self.application, actor=self.user, status="reviewing", note="Application review started.")
        self.assertEqual(self.application.events.count(), 1)
