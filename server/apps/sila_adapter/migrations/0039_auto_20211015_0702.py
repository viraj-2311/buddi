# Generated by Django 3.0.6 on 2021-10-15 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sila_adapter', '0038_silarequest_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='silarequest',
            name='show',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='silarequest',
            name='status',
            field=models.TextField(default='requested'),
        ),
    ]
