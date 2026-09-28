from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_GET


@require_GET
def health(request):
    return JsonResponse({"status": "ok", "service": "navijob-api"})


@require_GET
def csrf_token(request):
    # Returning a masked token also supports HttpOnly CSRF cookies.
    return JsonResponse({"csrfToken": get_token(request)})
