import logging
from dateutil.relativedelta import relativedelta

from django.conf import settings
from django.utils import timezone
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework import status

from . import services
from . import serializers
from .models import Subscription

logger = logging.getLogger(__name__)


class SubscriptionViewSet(ModelViewSet):
    service = services.LiqPayService()
    serializer_class = serializers.SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription = serializer.save()
        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        payment_data, payment_signature = self.service.create_payment_credentials_for_subscription(
            subscription=subscription,
            email=request.user.email
        )
        data['payment_data'] = payment_data
        data['payment_signature'] = payment_signature

        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class SubscriptionInfoView(GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        subscription = Subscription.objects.get_success_subscriptions(request.user).last()

        if subscription:
            start_date = subscription.subscription_end
        else:
            start_date = timezone.now()

        data = {
            'start_date': start_date,
            'end_date': start_date + relativedelta(months=+settings.DEFAULT_SUBSCRIPTION_MONTHS_PERIOD),
            'amount': settings.DEFAULT_SUBSCRIPTION_PRICE
        }
        return Response(data)


class LiqPayCallbackView(GenericAPIView):
    permission_classes = [AllowAny]
    service = services.LiqPayService()

    def post(self, request, *args, **kwargs):
        callback = self.service.decode_callback(request.data.get('data'), request.data.get('signature'))
        if callback:
            Subscription.objects.filter(id=callback['order_id']).update(callback=callback, status='success')
        return Response()
