from django.contrib.auth import get_user_model
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin, RetrieveModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from core.permissions import IsNotAuthenticated
from core.views import SignatureViewSet
from .models import EmailChangingRequest
from .serializers import UserProfileSerializer, UserRegistrationSerializer, ChangeUserPasswordSerializer, ChangeUserEmailSerializer

User = get_user_model()


class UserProfileAPIView(GenericAPIView, UpdateModelMixin, DestroyModelMixin, RetrieveModelMixin):
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


class UserRegistrationViewSet(GenericViewSet, CreateModelMixin):
    permission_classes = [IsNotAuthenticated]
    serializer_class = UserRegistrationSerializer
    queryset = User.objects.all()


class ChangeUserPasswordAPIView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangeUserPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'success'})


class UserRegistrationConfirmationViewSet(SignatureViewSet):
    queryset = User.objects.filter(is_active=False)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = True
        instance.save(update_fields=['is_active'])
        return Response({'status': 'success'})


class ChangeUserEmailViewSet(SignatureViewSet, CreateModelMixin):
    serializer_class = ChangeUserEmailSerializer

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return EmailChangingRequest.objects.filter(confirmed=False).select_related('user')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.update_user_email()
        return Response({'status': 'success'})
