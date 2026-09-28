from rest_framework.permissions import BasePermission


def verified_state(user):
    if not user.is_authenticated or not user.is_active:
        return None
    state = getattr(user, "account_state", None)
    if not state or not state.email_verified or state.verified_email.lower() != user.email.lower():
        return None
    return state


class IsVerifiedAccount(BasePermission):
    message = "Sign in with a confirmed email address to continue."

    def has_permission(self, request, view):
        return verified_state(request.user) is not None


class IsCandidate(IsVerifiedAccount):
    message = "This action is available to candidate accounts only."

    def has_permission(self, request, view):
        state = verified_state(request.user)
        return state is not None and state.role == "candidate"


class IsRecruiter(IsVerifiedAccount):
    message = "This action is available to recruiter accounts only."

    def has_permission(self, request, view):
        state = verified_state(request.user)
        return state is not None and state.role == "recruiter"
