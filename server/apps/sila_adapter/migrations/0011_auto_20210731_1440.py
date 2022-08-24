# Generated by Django 3.0.6 on 2021-07-31 14:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sila_adapter', '0010_plaidlinkedaccount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plaidlinkedaccount',
            name='account_owner_name',
            field=models.CharField(blank=True, default=None, max_length=120, null=True),
        ),
        migrations.AlterField(
            model_name='plaidlinkedaccount',
            name='match_score',
            field=models.FloatField(default=None, null=True),
        ),
    ]
