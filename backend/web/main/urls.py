from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserRegistrationViewSet, UserProfileAPIView, ChangeUserPasswordAPIView, ChangeUserEmailViewSet

router = DefaultRouter()
router.register('register', UserRegistrationViewSet, basename='registration')
router.register('profile/change_email', ChangeUserEmailViewSet, basename='change_email')

urlpatterns = [
    path('profile/', UserProfileAPIView.as_view()),
    path('profile/change_password/', ChangeUserPasswordAPIView.as_view())
]

urlpatterns += router.urls
