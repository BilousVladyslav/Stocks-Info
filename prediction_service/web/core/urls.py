from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from .yasg import urlpatterns as swagger_url

admin_url = settings.ADMIN_URL

urlpatterns = [
    path('api/', include('main.urls')),
    path(f'api/{admin_url}/', admin.site.urls),
    path('api/', include('rest_framework.urls')),
    path('api/rosetta/', include('rosetta.urls')),
]

urlpatterns += swagger_url

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    if settings.ENABLE_SILK:
        urlpatterns += [path('api/silk/', include('silk.urls', namespace='silk'))]
