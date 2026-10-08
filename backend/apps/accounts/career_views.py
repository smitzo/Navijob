from django.db import transaction
from rest_framework import generics, viewsets
from rest_framework.exceptions import ValidationError
from .career_serializers import CareerProfileSerializer, EducationSerializer, ExperienceSerializer, ProjectSerializer
from .models import ApplicantProfile, Education, Experience
from .permissions import IsCandidate


class CareerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CareerProfileSerializer
    permission_classes = [IsCandidate]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return ApplicantProfile.objects.get(user=self.request.user)


class OwnedCareerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsCandidate]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.filter(profile__user=self.request.user)

    @transaction.atomic
    def perform_create(self, serializer):
        profile = ApplicantProfile.objects.select_for_update().get(user=self.request.user)
        if self.get_queryset().count() >= 100:
            raise ValidationError("You can save up to 100 entries in this section.")
        serializer.save(profile=profile)


class ExperienceViewSet(OwnedCareerViewSet):
    serializer_class = ExperienceSerializer


class EducationViewSet(OwnedCareerViewSet):
    serializer_class = EducationSerializer


class ProjectViewSet(OwnedCareerViewSet):
    serializer_class = ProjectSerializer
