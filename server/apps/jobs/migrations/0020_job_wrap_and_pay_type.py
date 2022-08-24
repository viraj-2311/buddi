# Generated by Django 3.0.6 on 2021-11-22 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0019_jobmemoattachment_uploaded_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='wrap_and_pay_type',
            field=models.IntegerField(blank=True, choices=[(1, 'USE_BUDDI_TO_PAY_YOUR_CREW'), (2, 'REQUEST_INVOICES_AND_DOWNLOAD_PDF'), (3, 'DOWNLOAD_REPORT_AND_COMPLETE_JOB')], null=True),
        ),
    ]
