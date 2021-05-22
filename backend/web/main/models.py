import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractUser):
    email = models.EmailField(_('Email address'), unique=True)

    objects = UserManager()

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return self.email

    def full_name(self):
        return super().get_full_name()


class EmailChangingRequest(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, primary_key=True, verbose_name='UUID')
    user = models.ForeignKey('main.User', on_delete=models.CASCADE, verbose_name=_('User'))
    new_email = models.EmailField(_('Email address'), blank=False)
    is_active = models.BooleanField(default=True, verbose_name=_('active'))
    created = models.DateTimeField(auto_created=True, verbose_name=_('Created'))

    class Meta:
        verbose_name = _('Email changing request')
        verbose_name_plural = _('Email changing requests')

    def update_user_email(self):
        self.is_active = False
        self.user.email = self.new_email
        self.save(update_fields=['is_active'])
        self.user.save(update_fields=['email'])
