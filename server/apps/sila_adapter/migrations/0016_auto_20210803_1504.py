# Generated by Django 3.0.6 on 2021-08-03 15:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sila_adapter', '0015_auto_20210803_1324'),
    ]

    operations = [
        migrations.AlterField(
            model_name='silatosilatx',
            name='fiat_parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='request_txs', to='sila_adapter.FiatToSilaTx'),
        ),
    ]
