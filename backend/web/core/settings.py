import os
from datetime import timedelta

from django.utils.translation import gettext_lazy as _

from .additional_settings.defender_settings import *
from .additional_settings.swagger_settings import *
from .additional_settings.cacheops_settings import *
from .additional_settings.logging_settings import *
from .additional_settings.celery_settings import *
from .additional_settings.smtp_settings import *


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = int(os.environ.get("DEBUG", default=1))

ALLOWED_HOSTS: list = os.environ.get("DJANGO_ALLOWED_HOSTS").split(",")

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'main.User'
USER_CONFIRMATION_TIMEOUT = int(os.environ.get('USER_CONFIRMATION_TIMEOUT', 60 * 60 * 24))

SUPERUSER_EMAIL = os.environ.get('SUPERUSER_EMAIL', 'test@test.com')
SUPERUSER_USERNAME = os.environ.get('SUPERUSER_USERNAME', 'test')
SUPERUSER_PASSWORD = os.environ.get('SUPERUSER_PASSWORD', 'tester26')

LIQPAY_PUBLIC_KEY = os.environ.get('LIQPAY_PUBLIC_KEY')
LIQPAY_PRIVATE_KEY = os.environ.get('LIQPAY_PRIVATE_KEY')
SERVER_URL = os.environ.get('SERVER_URL', '')

DEFAULT_SUBSCRIPTION_MONTHS_PERIOD = os.environ.get('DEFAULT_SUBSCRIPTION_MONTHS_PERIOD', 6)
DEFAULT_SUBSCRIPTION_PRICE = os.environ.get('DEFAULT_SUBSCRIPTION_PRICE', 100)

MICROSERVICE_TITLE = os.environ.get('MICROSERVICE_TITLE', 'Stocks-Info')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'localhost:4200')

REDIS_URL = os.environ.get('REDIS_URL')

USE_HTTPS = int(os.environ.get('USE_HTTPS', 0))
ENABLE_SENTRY = int(os.environ.get('ENABLE_SENTRY', 0))
ENABLE_SILK = int(os.environ.get('ENABLE_SILK', 0))
ENABLE_DEBUG_TOOLBAR = int(os.environ.get('ENABLE_DEBUG_TOOLBAR', 0))
INTERNAL_IPS = []

ADMIN_URL = os.environ.get('ADMIN_URL', 'admin')

SWAGGER_URL = os.environ.get('SWAGGER_URL')

API_KEY_HEADER = os.environ.get('API_KEY_HEADER')
API_KEY = os.environ.get('API_KEY')

HEALTH_CHECK_URL = os.environ.get('HEALTH_CHECK_URL')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

]

THIRD_PARTY_APPS = [
    'defender',
    'rest_framework',
    'drf_yasg',
    'corsheaders',
    'rosetta',
]

LOCAL_APPS = [
    'main.apps.MainConfig',
    'subscriptions.apps.SubscriptionsConfig'
]

INSTALLED_APPS += THIRD_PARTY_APPS + LOCAL_APPS


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'main.middleware.HealthCheckMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'defender.middleware.FailedLoginMiddleware',
    'django.middleware.locale.LocaleMiddleware',

]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'microservice_request.permissions.HasApiKeyOrIsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=12),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=3),
    'ROTATE_REFRESH_TOKENS': True,
    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,

    'AUTH_HEADER_TYPES': ('JWT',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

ROOT_URLCONF = 'core.urls'

LOGIN_URL = 'rest_framework:login'
LOGOUT_URL = 'rest_framework:logout'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE"),
        "NAME": os.environ.get("POSTGRES_DB"),
        "USER": os.environ.get("POSTGRES_USER"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
        "HOST": os.environ.get("POSTGRES_HOST"),
        "PORT": os.environ.get("POSTGRES_PORT"),
        "CONN_MAX_AGE": 0,
    },
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

LANGUAGES = (
    ('en', _('English')),
)

ROSETTA_MESSAGES_SOURCE_LANGUAGE_CODE = LANGUAGE_CODE
ROSETTA_MESSAGES_SOURCE_LANGUAGE_NAME = 'English'
ROSETTA_SHOW_AT_ADMIN_PANEL = True
ROSETTA_ENABLE_TRANSLATION_SUGGESTIONS = False


if JAEGER_AGENT_HOST := os.environ.get('JAEGER_AGENT_HOST'):
    from jaeger_client import Config
    from jaeger_client.config import DEFAULT_REPORTING_PORT
    from django_opentracing import DjangoTracing
    """If you don't need to trace all requests, comment middleware and set OPENTRACING_TRACE_ALL = False
        More information https://github.com/opentracing-contrib/python-django/#tracing-individual-requests
    """
    MIDDLEWARE.insert(0, 'django_opentracing.OpenTracingMiddleware')
    OPENTRACING_TRACE_ALL = True
    tracer = Config(
        config={
            "sampler": {"type": "const", "param": 1},
            "local_agent": {
                "reporting_port": os.environ.get("JAEGER_AGENT_PORT", DEFAULT_REPORTING_PORT),
                "reporting_host": JAEGER_AGENT_HOST,
            },
            "logging": int(os.environ.get('JAEGER_LOGGING', False)),
        },
        service_name=MICROSERVICE_TITLE,
        validate=True,
    ).initialize_tracer()
    OPENTRACING_TRACING = DjangoTracing(tracer)

if (SENTRY_DSN := os.environ.get('SENTRY_DSN')) and ENABLE_SENTRY:
    # More information on site https://sentry.io/
    from sentry_sdk import init
    from sentry_sdk.integrations.django import DjangoIntegration
    init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,

        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True
    )
