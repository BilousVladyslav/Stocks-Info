# Generated by Django 3.2.2 on 2021-05-23 18:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_emailchangingrequest'),
    ]

    operations = [
        migrations.RenameField(
            model_name='emailchangingrequest',
            old_name='is_active',
            new_name='confirmed',
        ),
    ]
