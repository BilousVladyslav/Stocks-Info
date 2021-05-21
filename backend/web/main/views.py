from django.contrib.auth import get_user_model
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin, RetrieveModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from core.permissions import IsNotAuthenticated
from .serializers import UserProfileSerializer, UserRegistrationSerializer

User = get_user_model()


class UserProfile(GenericAPIView, UpdateModelMixin, DestroyModelMixin, RetrieveModelMixin):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, args, kwargs)

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, args, kwargs)

    def post(self, request, *args, **kwargs):
        return self.update(request, args, kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, args, kwargs)


class UserRegistration(GenericViewSet, CreateModelMixin):
    permission_classes = [IsNotAuthenticated]
    serializer_class = UserRegistrationSerializer
    queryset = User.objects.all()
