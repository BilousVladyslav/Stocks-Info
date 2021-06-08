from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .yasg import urlpatterns as swagger_url

admin_url = settings.ADMIN_URL

urlpatterns = [
    path('api/', include('main.urls')),
    path('api/', include('subscriptions.urls')),
    path(f'api/{admin_url}/', admin.site.urls),
    path(f'api/{admin_url}/defender/', include('defender.urls')),
    path('api/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/rosetta/', include('rosetta.urls')),
]

urlpatterns += swagger_url

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    if settings.ENABLE_SILK:
        urlpatterns += [path('api/silk/', include('silk.urls', namespace='silk'))]
    if settings.ENABLE_DEBUG_TOOLBAR:
        from debug_toolbar import urls
        urlpatterns += [path('api/__debug__/', include(urls))]
