from django.contrib.auth import get_user_model
from apps.accounts.models import AccountState, RecruiterProfile
from .models import Company


def recruiter(email, company=None, verified=True, manager=True):
    company = company or Company.objects.create(name="Example hiring team", slug=email.split("@")[0], website="https://example.com", is_verified=verified, review_status="approved" if verified else "pending")
    user = get_user_model().objects.create_user(username=email, email=email, password="Local-Pass-42")
    AccountState.objects.create(user=user, role="recruiter", email_verified=True, verified_email=email)
    RecruiterProfile.objects.create(user=user, company=company, can_manage_company=manager, is_verified=verified)
    return user
