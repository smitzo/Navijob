import hashlib
import json
from django.core import signing
from django.core.files.base import ContentFile
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.http import FileResponse
from django.utils import timezone
from rest_framework.exceptions import APIException, NotFound, ValidationError
from apps.accounts.career_serializers import CareerProfileSerializer, ProjectSerializer
from apps.accounts.models import ApplicantProfile
from apps.resumes.models import Resume
from .models import ApplicationEvent, Job, JobApplication
from .serializers import JobListSerializer

REVIEW_SALT = "navijob.application-review.v1"


class ApplicationConflict(APIException):
    status_code = 409


def submission_bundle(profile, job, resume):
    if not resume.pdf_file:
        raise ValidationError({"resume": "Upload a PDF before choosing this version."})
    digest = resume.content_sha256
    if not digest:
        try:
            with resume.pdf_file.open("rb") as file:
                digest = hashlib.sha256(file.read()).hexdigest()
        except FileNotFoundError as error:
            raise ValidationError({"resume": "This resume file is unavailable."}) from error
    bundle = {"schema_version": 1, "candidate": CareerProfileSerializer(profile).data, "projects": ProjectSerializer(profile.projects.all(), many=True).data, "job": JobListSerializer(job).data, "questions": job.application_questions, "resume": {"id": resume.pk, "title": resume.title, "filename": resume.original_filename, "size": resume.file_size, "sha256": digest}}
    encoded = json.dumps(bundle, cls=DjangoJSONEncoder, sort_keys=True, separators=(",", ":"))
    return json.loads(encoded), hashlib.sha256(encoded.encode()).hexdigest()


def application_review(user, job, resume_id):
    if not job.accepting_applications or job.application_mode != "native":
        raise ValidationError("This role does not accept applications on NaviJob.")
    profile = ApplicantProfile.objects.select_related("user").get(user=user)
    try:
        resume = Resume.objects.get(pk=resume_id, user=user)
    except Resume.DoesNotExist as error:
        raise ValidationError({"resume": "Choose one of your uploaded resumes."}) from error
    bundle, digest = submission_bundle(profile, job, resume)
    token = signing.dumps({"user": user.pk, "job": job.pk, "resume": resume.pk, "digest": digest}, salt=REVIEW_SALT)
    return {"snapshot": bundle, "review_token": token}


@transaction.atomic
def submit_application(user, values):
    profile = ApplicantProfile.objects.select_for_update().select_related("user").get(user=user)
    existing = JobApplication.objects.filter(applicant=profile, job_id=values["job_id"]).first()
    if existing:
        raise ApplicationConflict({"detail": "You already applied to this role.", "code": "already_applied", "application_id": existing.pk})
    try:
        job = Job.objects.select_for_update().select_related("company").get(pk=values["job_id"])
    except Job.DoesNotExist as error:
        raise NotFound("This role is unavailable.") from error
    if not job.accepting_applications or job.application_mode != "native":
        raise ValidationError("This role does not accept new applications on NaviJob.")
    if not profile.headline.strip() or not profile.location.strip():
        raise ValidationError("Add a headline and location to your career profile before applying.")
    try:
        resume = Resume.objects.select_for_update().get(pk=values["resume"], user=user)
    except Resume.DoesNotExist as error:
        raise ValidationError({"resume": "Choose one of your uploaded resumes."}) from error
    bundle, digest = submission_bundle(profile, job, resume)
    try:
        review = signing.loads(values["review_token"], salt=REVIEW_SALT, max_age=900)
    except signing.BadSignature as error:
        raise ApplicationConflict({"detail": "Your review expired. Refresh the preview and review it again.", "code": "review_changed"}) from error
    if review != {"user": user.pk, "job": job.pk, "resume": resume.pk, "digest": digest}:
        raise ApplicationConflict({"detail": "Your profile, resume or role changed. Refresh the preview and review it again.", "code": "review_changed"})
    answers = values.get("answers", {})
    allowed = {question["id"] for question in job.application_questions}
    if set(answers) - allowed:
        raise ValidationError({"answers": "Only answer the questions shown for this role."})
    for question in job.application_questions:
        if question.get("required") and not answers.get(question["id"], "").strip():
            raise ValidationError({"answers": f"Answer: {question['label']}"})
    application = JobApplication(job=job, applicant=profile, resume=resume, snapshot=bundle, answers=answers, cover_letter=values.get("cover_letter", ""), submitted_at=timezone.now())
    try:
        try:
            with resume.pdf_file.open("rb") as file:
                content = file.read()
        except FileNotFoundError as error:
            raise ValidationError({"resume": "This resume file is unavailable. Upload a new version."}) from error
        if hashlib.sha256(content).hexdigest() != bundle["resume"]["sha256"]:
            raise ValidationError({"resume": "The selected file changed. Upload a fresh version."})
        application.resume_snapshot_file.save("resume.pdf", ContentFile(content), save=False)
        application.save()
        ApplicationEvent.objects.create(application=application, actor=user, status="submitted", note="Application received on NaviJob.")
    except Exception:
        if application.resume_snapshot_file.name:
            application.resume_snapshot_file.storage.delete(application.resume_snapshot_file.name)
        raise
    return application


def application_resume_response(application):
    if not application.resume_snapshot_file:
        raise NotFound("No submitted PDF is available for this application.")
    try:
        response = FileResponse(application.resume_snapshot_file.open("rb"), as_attachment=True, filename=application.snapshot.get("resume", {}).get("filename") or "submitted-resume.pdf", content_type="application/pdf")
    except FileNotFoundError as error:
        raise NotFound("The submitted resume file is unavailable.") from error
    response["Cache-Control"] = "private, no-store"
    return response
