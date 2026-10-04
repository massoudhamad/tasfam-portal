"""Indicators API URLs."""
from django.urls import path
from . import views

urlpatterns = [
    path('indicators', views.IndicatorListView.as_view(), name='indicator-list'),
]
