from django.db import models
from django.utils import timezone


class SubscriptionManager(models.Manager):

    def get_success_subscriptions(self, user):
        if not user:
            return self.none()
        return self.filter(user=user, status='success').order_by('subscription_end')

    def get_active_subscription(self, user):
        if not user:
            return self.none()
        return self.get_success_subscriptions(user).filter(subscription_end__gte=timezone.now()).last()
