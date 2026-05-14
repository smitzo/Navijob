from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import WaitlistLeadSerializer


class WaitlistLeadCreateView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = WaitlistLeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        return Response({"id": str(lead.id), "message": "Joined waitlist"}, status=status.HTTP_201_CREATED)
