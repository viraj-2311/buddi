# Generated by Django 3.0.6 on 2021-06-26 08:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0011_usercontact_is_personal'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sila_adapter', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SilaCorporate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_handle', models.CharField(help_text='Unique ID in Sila', max_length=50)),
            ],
        ),
        migrations.RemoveConstraint(
            model_name='silauser',
            name='unique_sila_user',
        ),
        migrations.AddField(
            model_name='silauser',
            name='user_handle',
            field=models.CharField(default=' ', help_text='Unique ID in Sila', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='silauser',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='sila_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='silacorporate',
            name='company',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='sila_corporate', to='user.Company'),
        ),
    ]
