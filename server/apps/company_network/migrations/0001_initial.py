# Generated by Django 3.0.6 on 2021-03-19 16:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Favorites',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.Company')),
                ('friend', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_network_friend', to=settings.AUTH_USER_MODEL)),
                ('poster', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_network_poster', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'company_network_favorites',
            },
        ),
        migrations.CreateModel(
            name='CompanyNetwork',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accepted', models.BooleanField(default=False)),
                ('rejected', models.BooleanField(default=False)),
                ('notes', models.CharField(blank=True, max_length=500, null=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.Company')),
                ('invitee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_network_invitee', to=settings.AUTH_USER_MODEL)),
                ('invitor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_network_invitor', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'company_network',
                'unique_together': {('invitor', 'invitee', 'company')},
            },
        ),
    ]
