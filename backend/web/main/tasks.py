from django.contrib.auth import get_user_model

from core.celery import app
from .models import EmailChangingRequest

User = get_user_model()


@app.task
def delete_unconfirmed_user(user_id: int):
    return User.objects.filter(id=user_id, is_active=False).delete()


@app.task
def disable_new_email_request(request_id: str):
    return EmailChangingRequest.objects.filter(uuid=request_id, is_active=True).update(is_active=False)
