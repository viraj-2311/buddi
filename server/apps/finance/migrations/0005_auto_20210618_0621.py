# Generated by Django 3.0.6 on 2021-06-18 06:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0004_auto_20210404_0803'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoicememo',
            name='kit_fee',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AlterField(
            model_name='invoicememo',
            name='project_rate',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AlterField(
            model_name='invoicememo',
            name='working_rate',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
    ]
