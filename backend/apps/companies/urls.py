from rest_framework.routers import DefaultRouter
from .views import PublicCompanyViewSet
router = DefaultRouter()
router.register("", PublicCompanyViewSet, basename="company")
urlpatterns = router.urls
