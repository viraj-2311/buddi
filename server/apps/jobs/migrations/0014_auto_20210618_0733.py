# Generated by Django 3.0.6 on 2021-06-18 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0013_jobmemorate_price_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobmemo',
            name='project_rate',
            field=models.FloatField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='jobmemo',
            name='working_rate',
            field=models.FloatField(blank=True, default=0, null=True),
        ),
    ]
