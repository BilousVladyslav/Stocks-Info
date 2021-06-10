from .settings import INSTALLED_APPS, MIDDLEWARE, ENABLE_SILK, INTERNAL_IPS
from .settings import *

CORS_ORIGIN_ALLOW_ALL = True

if ENABLE_SILK:
    INSTALLED_APPS += ['silk']
    MIDDLEWARE += ['silk.middleware.SilkyMiddleware']
