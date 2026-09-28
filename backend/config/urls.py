from django.contrib import admin
from django.urls import include, path
from apps.core.views import csrf_token, health

urlpatterns = [
    path("api/health/", health),
    path("api/auth/csrf/", csrf_token),
    path("admin/", admin.site.urls),
    path("api/", include("apps.jobs.urls")),
    path("api/waitlist/", include("apps.waitlist.urls")),
]
