from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

app_name = 'subscriptions'

router = SimpleRouter()
router.register('subscription', views.SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('payment/callback/', views.LiqPayCallbackView.as_view(), name='payment-callback'),
    path('subscriptions/data/', views.SubscriptionInfoView.as_view(), name='subscription-info'),
]

urlpatterns += router.urls
