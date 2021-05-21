import logging

from django.conf import settings
from django.core.mail import send_mail

from .celery import app


@app.task(bind=True, default_retry_delay=1)
def send_email_task(self, title: str, content: str, content_html: str, receivers: list[str]):
    try:
        send_mail(
            title,
            content,
            settings.DEFAULT_FROM_EMAIL,
            receivers,
            html_message=content_html,
            fail_silently=False,
        )
    except Exception as e:
        logging.error(' Letter does not sent: ' + str(e))
        self.retry(exc=e, max_retries=1)
