# Generated by Django 3.0.6 on 2022-01-17 14:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0011_auto_20211221_2042'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='status_message',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
