from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.jobs.views import JobApplicationViewSet, PublicJobViewSet

router = DefaultRouter()
router.register("jobs", PublicJobViewSet, basename="job")
router.register("applications", JobApplicationViewSet, basename="job-application")

urlpatterns = [
    path("", include(router.urls)),
]
