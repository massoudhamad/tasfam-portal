"""TASFAM URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from two_factor.urls import urlpatterns as tf_urls

urlpatterns = [
    # Two-factor auth
    path('', include(tf_urls)),

    # Admin
    path('admin/', admin.site.urls),

    # API
    path('api/v1/', include('content.api.urls')),
    path('api/v1/', include('grievances.api.urls')),
    path('api/v1/', include('indicators.api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = 'TASFAM Portal Administration'
admin.site.site_title = 'TASFAM Admin'
admin.site.index_title = 'Content Management System'
