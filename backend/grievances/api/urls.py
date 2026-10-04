"""Grievance API URLs."""
from django.urls import path
from . import views

urlpatterns = [
    path('grievances', views.GrievanceSubmitView.as_view(), name='grievance-submit'),
    path('grievances/status', views.GrievanceStatusView.as_view(), name='grievance-status'),
]
