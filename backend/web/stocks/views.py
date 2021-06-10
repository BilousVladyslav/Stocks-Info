import logging
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework.viewsets import GenericViewSet
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework import status

from . import services
from . import serializers
from .models import Product

logger = logging.getLogger(__name__)


class StocksViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    permission_classes = [AllowAny]
    queryset = Product.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProductsSerializer
        return serializers.ProductDataSerializer
