from dateutil.relativedelta import relativedelta

from django.conf import settings
from django.utils import timezone
from rest_framework import serializers

from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        exclude = ('callback', 'user')
        read_only_fields = ('subscription_start', 'subscription_end', 'status', 'callback', 'amount')

    def create(self, validated_data):
        start_date = timezone.now()
        end_date = start_date + relativedelta(months=+settings.DEFAULT_SUBSCRIPTION_MONTHS_PERIOD)
        subscription = Subscription.objects.create(
            **validated_data,
            user=self.context['request'].user,
            amount=settings.DEFAULT_SUBSCRIPTION_PRICE,
            subscription_start=start_date,
            subscription_end=end_date,
            status='created'
        )
        return subscription
