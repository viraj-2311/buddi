# Generated by Django 3.0.6 on 2021-07-23 07:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0006_auto_20210708_1528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='invoice_memo',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='finance.InvoiceMemo'),
        ),
    ]
