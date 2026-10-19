from django.core.files.uploadedfile import SimpleUploadedFile
from apps.resumes.models import Resume
from .applications import application_review, submit_application


def submitted_application(user, job):
    profile = user.applicant_profile
    profile.headline = "Backend engineer"
    profile.location = "Bengaluru"
    profile.save()
    resume = Resume.objects.create(user=user, title="Test resume", pdf_file=SimpleUploadedFile("resume.pdf", b"%PDF-1.4\nTest content", content_type="application/pdf"))
    review = application_review(user, job, resume.pk)
    return submit_application(user, {"job_id": job.pk, "resume": resume.pk, "review_token": review["review_token"], "consent": True})
