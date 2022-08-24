# Generated by Django 3.0.6 on 2021-07-23 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sila_adapter', '0006_auto_20210704_0808'),
    ]

    operations = [
        migrations.AlterField(
            model_name='silacorporate',
            name='business_type',
            field=models.CharField(choices=[('CORPORATION', 'Corporation'), ('LLC', 'LLC'), ('LLP', 'LLP'), ('LP', 'LP'), ('NON-PROFIT', 'Non-Profit'), ('PARTNERSHIP', 'Partnership'), ('PUBLIC CORPORATION', 'Public Corporation'), ('SOLE PROPRIETORSHIP', 'Sole Proprietorship'), ('TRUST', 'Trust'), ('UNINCORPORATED ASSOCIATION', 'Unincorporated Association')], default='CORPORATION', max_length=255),
        ),
        migrations.AlterField(
            model_name='silacorporate',
            name='category',
            field=models.CharField(choices=[('PRODUCTION COMPANY', 'PRODUCTION COMPANY'), ('IN-HOUSE PRODUCTION COMPANY', 'In-house Production Company')], default='PRODUCTION COMPANY', max_length=30),
        ),
    ]
