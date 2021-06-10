import hashlib

from django.conf import settings
from django.core import exceptions
from django.core.signing import TimestampSigner
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.template.loader import get_template
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from core.serializers import CreateSerializerMixin, UpdateSerializerMixin

User = get_user_model()
