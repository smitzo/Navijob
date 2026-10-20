from rest_framework.routers import DefaultRouter
from .recruiter_views import RecruiterJobViewSet
from .recruiter_applications import RecruiterApplicationViewSet
router = DefaultRouter()
router.register("jobs", RecruiterJobViewSet, basename="recruiter-job")
router.register("applications", RecruiterApplicationViewSet, basename="recruiter-application")
urlpatterns = router.urls
