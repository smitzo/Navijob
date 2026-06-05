from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import ApplicantProfile, RecruiterProfile
from apps.companies.models import Company
from apps.jobs.models import Job, JobApplication
from apps.resumes.models import Resume


User = get_user_model()


def create_company():
    return Company.objects.create(
        name="SignalForge",
        slug="signalforge",
        stage=Company.Stage.SEED,
        company_size=Company.CompanySize.ELEVEN_TO_FIFTY,
        industry="Developer Tools",
        is_verified=True,
        is_premium_partner=True,
    )


def create_job(company, **overrides):
    defaults = {
        "company": company,
        "title": "Founding Backend Engineer",
        "slug": "founding-backend-engineer",
        "status": Job.Status.PUBLISHED,
        "description": "Build the core hiring platform.",
        "location": "Remote",
        "work_mode": Job.WorkMode.REMOTE,
        "job_type": Job.JobType.FULL_TIME,
        "currency": "USD",
        "salary_min": 120000,
        "salary_max": 180000,
        "equity_min": "0.20",
        "equity_max": "0.80",
        "skills": ["Python", "Django"],
        "apply_url": "https://example.com/apply",
        "is_verified": True,
        "is_premium": True,
        "premium_score": 92,
        "is_active": True,
        "published_at": timezone.now(),
    }
    defaults.update(overrides)
    return Job.objects.create(**defaults)


class JobModelValidationTests(TestCase):
    def test_job_rejects_invalid_salary_range(self):
        company = create_company()

        with self.assertRaises(ValidationError):
            create_job(company, salary_min=200000, salary_max=100000)

    def test_application_requires_published_active_job(self):
        company = create_company()
        user = User.objects.create_user(username="candidate", email="candidate@example.com")
        applicant = ApplicantProfile.objects.create(user=user)
        job = create_job(company, status=Job.Status.DRAFT)

        application = JobApplication(job=job, applicant=applicant)

        with self.assertRaises(ValidationError):
            application.full_clean()

    def test_application_resume_must_belong_to_applicant(self):
        company = create_company()
        applicant_user = User.objects.create_user(username="candidate", email="candidate@example.com")
        other_user = User.objects.create_user(username="other", email="other@example.com")
        applicant = ApplicantProfile.objects.create(user=applicant_user)
        resume = Resume.objects.create(user=other_user)
        job = create_job(company)

        application = JobApplication(job=job, applicant=applicant, resume=resume)

        with self.assertRaises(ValidationError):
            application.full_clean()


class JobApiTests(APITestCase):
    def test_public_job_list_returns_only_published_active_jobs(self):
        company = create_company()
        visible_job = create_job(company)
        create_job(company, slug="draft-role", title="Draft Role", status=Job.Status.DRAFT)
        create_job(company, slug="inactive-role", title="Inactive Role", is_active=False)

        response = self.client.get(reverse("job-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["slug"], visible_job.slug)

    def test_public_job_list_filters_by_search_query(self):
        company = create_company()
        create_job(company, title="Founding Backend Engineer")
        create_job(company, slug="product-designer", title="Product Designer", skills=["Figma"])

        response = self.client.get(reverse("job-list"), {"q": "Backend"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Founding Backend Engineer")

    def test_authenticated_applicant_can_apply_to_job(self):
        company = create_company()
        job = create_job(company)
        user = User.objects.create_user(username="candidate", email="candidate@example.com")
        ApplicantProfile.objects.create(user=user)
        self.client.force_authenticate(user=user)

        response = self.client.post(
            reverse("job-application-list"),
            {"job_id": job.id, "cover_letter": "I can help."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.count(), 1)
        self.assertEqual(JobApplication.objects.get().job, job)

    def test_authenticated_user_without_applicant_profile_cannot_apply(self):
        company = create_company()
        job = create_job(company)
        user = User.objects.create_user(username="recruiter", email="recruiter@example.com")
        RecruiterProfile.objects.create(user=user, company=company)
        self.client.force_authenticate(user=user)

        response = self.client.post(reverse("job-application-list"), {"job_id": job.id}, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
