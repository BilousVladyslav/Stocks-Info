import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import SubscriptionManager


class Subscription(models.Model):
    id = models.UUIDField(_('UUID'), primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('main.User', on_delete=models.CASCADE, verbose_name=_('Subscriber'))

    subscription_start = models.DateTimeField(_('Start date'), blank=False, editable=False)
    subscription_end = models.DateTimeField(_('End date'), blank=False, editable=False)

    amount = models.DecimalField(_('Price'), max_digits=8, decimal_places=2, blank=False, editable=False, default=0)
    status = models.CharField(_('LiqPay status'), blank=True, editable=False, max_length=255)
    callback = models.JSONField(_('LiqPay callback'), default=dict, blank=True)

    objects = SubscriptionManager()

    class Meta:
        ordering = ('-subscription_end', '-status')
        verbose_name = _('Subscription')
        verbose_name_plural = _('Subscriptions')
