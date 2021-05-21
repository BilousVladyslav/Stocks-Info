from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserRegistration, UserProfile

router = DefaultRouter()
router.register('register', UserRegistration, basename='machine')

urlpatterns = [
    path('profile/', UserProfile.as_view()),
]

urlpatterns += router.urls
