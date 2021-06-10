# Generated by Django 3.2.2 on 2021-06-10 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=127, unique=True, verbose_name='Product code')),
                ('name', models.CharField(max_length=255, verbose_name='Product name')),
                ('sector', models.CharField(max_length=255, verbose_name='Product sector')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created')),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
                'ordering': ('-created',),
            },
        ),
    ]
