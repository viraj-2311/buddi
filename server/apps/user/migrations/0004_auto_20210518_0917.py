# Generated by Django 3.0.6 on 2021-05-18 09:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20210518_0905'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpress',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='presses', to=settings.AUTH_USER_MODEL),
        ),
    ]
