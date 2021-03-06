import hashlib

from django.conf import settings
from django.core import exceptions
from django.core.signing import TimestampSigner
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.template.loader import get_template
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .tasks import delete_unconfirmed_user
from .models import EmailChangingRequest
from core.serializers import CreateSerializerMixin, UpdateSerializerMixin
from core.tasks import send_email_task

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_second = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password_second')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'min_length': 8,
                'required': True,
                'max_length': 40
            }
        }

    def validate(self, attrs):
        if attrs.get('password') == attrs.get('password_second'):
            attrs['password'] = make_password(attrs['password'])
            attrs.pop('password_second')
        else:
            raise serializers.ValidationError({'password': _('Passwords not match')})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(**validated_data, is_active=False)
        delete_unconfirmed_user.apply_async((user.id,), countdown=settings.USER_CONFIRMATION_TIMEOUT)

        user_id_signature = TimestampSigner().sign(user.id)
        link = 'http://' + settings.FRONTEND_URL + f'/registration_complete/{user_id_signature}'
        html_content = get_template('email_letters/registration_confirmation.html').render({'confirmation_link': link})
        subject = _('Registration confirmation')
        send_mail(
            subject,
            '',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_content,
            fail_silently=False,
        )
        send_email_task.delay(subject, '',  html_content, [user.email])

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'is_superuser', 'is_staff')
        read_only_fields = ('email', 'username', 'is_superuser', 'is_staff')


class ChangeUserPasswordSerializer(CreateSerializerMixin, UpdateSerializerMixin, serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    password_second = serializers.CharField(required=True)

    def validate_old_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError(_('Wrong password'))
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        errors = dict()
        try:
            validate_password(password=value, user=user)
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return value

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('password_second'):
            raise serializers.ValidationError({'new_password': _('Passwords not match')})
        return attrs

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])


class ChangeUserEmailSerializer(serializers.ModelSerializer):

    def validate_new_email(self, value):
        user_email_exists = User.objects.filter(email=value).exists()
        if user_email_exists or EmailChangingRequest.objects.filter(new_email=value, confirmed=True).exists():
            raise serializers.ValidationError(_('Email already taken.'))

        return value

    class Meta:
        model = EmailChangingRequest
        fields = ('new_email',)

    def create(self, validated_data):
        user = self.context['request'].user
        request = EmailChangingRequest.objects.create(**validated_data, user=user)

        request_uuid_signature = TimestampSigner().sign(request.uuid)
        context = {'confirmation_link': 'http://' + settings.FRONTEND_URL + f'/change_email/{request_uuid_signature}'}
        html_content = get_template('email_letters/email_changing_confirmation.html').render(context)
        subject = _('Email changing confirmation')
        send_mail(
            subject,
            '',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_content,
            fail_silently=False,
        )
        send_email_task.delay(subject, '',  html_content, [user.email])

        return request
