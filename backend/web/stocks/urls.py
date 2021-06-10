from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'stocks'

router = DefaultRouter()
router.register('product', views.StocksViewSet, basename='stock')

urlpatterns = [

]

urlpatterns += router.urls
