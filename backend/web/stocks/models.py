import json

from django.db import models
from django.utils.translation import gettext_lazy as _
from yfinance import Ticker

from . import managers


class Product(models.Model):
    code = models.CharField(_('Product code'), max_length=127, unique=True)
    name = models.CharField(_('Product name'), max_length=255)
    sector = models.CharField(_('Product sector'), max_length=255)
    description = models.TextField(_('Description'), blank=True)
    created = models.DateTimeField(_('Created'), auto_now_add=True)
    logo_url = models.URLField(_('Logo URL'), blank=True)

    class Meta:
        ordering = ('-created', )
        verbose_name = _('Product')
        verbose_name_plural = _('Products')

    def history(self, *args, **kwargs):
        data = Ticker(self.code).history(*args, **kwargs).to_json(orient="table")
        return json.loads(data)['data']

    def info(self):
        return Ticker(self.code).info

    def last_recommendations(self):
        data = Ticker(self.code).recommendations.to_json(orient="table")
        return json.loads(data)['data']


