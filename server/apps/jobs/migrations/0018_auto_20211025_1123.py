# Generated by Django 3.0.6 on 2021-10-25 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0017_auto_20211025_1119'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='job_number',
            field=models.CharField(max_length=255),
        ),
    ]
