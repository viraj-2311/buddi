# Generated by Django 3.0.6 on 2021-12-12 09:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0022_auto_20211208_0853'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobmemoinvitationtoken',
            name='job_memo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitation_tokens', to='jobs.JobMemo'),
        ),
    ]
