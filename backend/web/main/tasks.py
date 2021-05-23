from django.contrib.auth import get_user_model

from core.celery import app

User = get_user_model()


@app.task
def delete_unconfirmed_user(user_id: int):
    return User.objects.filter(id=user_id, is_active=False).delete()
