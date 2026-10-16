from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.jobs.views import PublicJobViewSet
from apps.jobs.application_views import JobApplicationViewSet
from apps.jobs.saved_views import SavedJobViewSet

router = DefaultRouter()
router.register("jobs", PublicJobViewSet, basename="job")
router.register("applications", JobApplicationViewSet, basename="job-application")
router.register("saved-jobs", SavedJobViewSet, basename="saved-job")

urlpatterns = [
    path("", include(router.urls)),
]
