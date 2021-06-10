from django.contrib import admin

from .models import Subscription


@admin.register(Subscription)
class SubscriptionModelAdmin(admin.ModelAdmin):
    list_filter = ('status',)
    pass
