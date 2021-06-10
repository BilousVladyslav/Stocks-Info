from core.celery import app
from .models import Subscription


@app.task
def delete_subscription_if_not_payed(subscription_id):
    return Subscription.objects.filter(id=subscription_id, status='created').delete()
