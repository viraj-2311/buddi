# Generated by Django 3.0.6 on 2021-04-12 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0010_jobmemo_headline'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobrolegroup',
            name='order',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
