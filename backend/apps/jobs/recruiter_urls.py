from rest_framework.routers import DefaultRouter
from .recruiter_views import RecruiterJobViewSet
router = DefaultRouter()
router.register("jobs", RecruiterJobViewSet, basename="recruiter-job")
urlpatterns = router.urls
