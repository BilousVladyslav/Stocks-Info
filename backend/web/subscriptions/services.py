import logging

from django.conf import settings
from django.urls import reverse
from liqpay.liqpay3 import LiqPay

from .models import Subscription


logger = logging.getLogger(__name__)


def output_callback(callback: dict) -> None:
    logger.info('===========================================')
    logger.info('')
    for key, value in callback.items():
        logger.info(f'{key}: {value}')
    logger.info('')
    logger.info('===========================================')


class LiqPayService:
    liqpay = LiqPay(settings.LIQPAY_PUBLIC_KEY, settings.LIQPAY_PRIVATE_KEY)

    def _create_payment_credentials(self, order_id: str, description: str, amount):
        params = {
            'action': 'pay',
            'amount': '{0:.2f}'.format(amount),
            'currency': 'USD',
            'description': description,
            'order_id': order_id,
            'version': '3',
            'sandbox': 1,
            'result_url': settings.FRONTEND_URL + '/profile',
            'server_url': settings.SERVER_URL + reverse('subscriptions:payment-callback'),
        }
        signature = self.liqpay.cnb_signature(params)
        data = self.liqpay.cnb_data(params)
        return data, signature

    def create_payment_credentials_for_subscription(self, subscription: Subscription, email: str):
        description = f'Subscription payment for {email}. ' \
                      f'Period: {subscription.subscription_start} - {subscription.subscription_end}'
        data, signature = self._create_payment_credentials(
            order_id=str(subscription.id),
            description=description,
            amount=settings.DEFAULT_SUBSCRIPTION_PRICE
        )
        return data, signature

    def decode_callback(self, data: str, signature: str) -> dict:
        sign = self.liqpay.str_to_sign(settings.LIQPAY_PRIVATE_KEY + data + settings.LIQPAY_PRIVATE_KEY)
        if sign == signature:
            return self.liqpay.decode_data_from_str(data)
        return dict()
