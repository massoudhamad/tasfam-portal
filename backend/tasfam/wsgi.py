"""WSGI config for TASFAM project."""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tasfam.settings')
application = get_wsgi_application()
