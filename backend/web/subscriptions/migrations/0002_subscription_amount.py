# Generated by Django 3.2.2 on 2021-06-07 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0, editable=False, max_digits=8, verbose_name='Price'),
        ),
    ]
