from __future__ import absolute_import, unicode_literals

import logging
import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "benji_app.settings")

app = Celery("benji_app")
app.config_from_object("django.conf:settings",  namespace="CELERY")
app.autodiscover_tasks()

logger = logging.getLogger(__name__)
