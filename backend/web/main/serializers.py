from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_second = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs.get('password') == attrs.get('password_second'):
            attrs['password'] = make_password(attrs['password'])
            attrs.pop('password_second')
        else:
            raise serializers.ValidationError({'password': _('Passwords not match')})

        return attrs

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name',  'password', 'password_second')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'min_length': 8,
                'required': True,
                'max_length': 40
            }
        }


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name',  'is_superuser', 'is_staff')
        read_only_fields = ('email', 'username', 'is_superuser', 'is_staff')
