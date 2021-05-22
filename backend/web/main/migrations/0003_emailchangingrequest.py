# Generated by Django 3.2.2 on 2021-05-22 17:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_set_superuser'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailChangingRequest',
            fields=[
                ('created', models.DateTimeField(auto_created=True, verbose_name='Created')),
                ('uuid', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, verbose_name='UUID')),
                ('new_email', models.EmailField(max_length=254, verbose_name='Email address')),
                ('is_active', models.BooleanField(default=True, verbose_name='active')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Email changing request',
                'verbose_name_plural': 'Email changing requests',
            },
        ),
    ]
