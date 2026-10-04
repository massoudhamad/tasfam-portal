"""Content API URLs."""
from django.urls import path
from . import views

urlpatterns = [
    # News
    path('news', views.NewsListView.as_view(), name='news-list'),
    path('news/<slug:slug>', views.NewsDetailView.as_view(), name='news-detail'),

    # Publications
    path('publications', views.PublicationListView.as_view(), name='publication-list'),

    # Tenders
    path('tenders', views.TenderListView.as_view(), name='tender-list'),
    path('tenders/<slug:slug>', views.TenderDetailView.as_view(), name='tender-detail'),

    # Components and Sub-projects
    path('components', views.ComponentListView.as_view(), name='component-list'),
    path('sub-projects', views.SubProjectListView.as_view(), name='subproject-list'),
    path('sub-projects.geojson', views.SubProjectGeoJSONView.as_view(), name='subproject-geojson'),

    # Stories
    path('stories', views.StoryListView.as_view(), name='story-list'),
    path('stories/<slug:slug>', views.StoryDetailView.as_view(), name='story-detail'),

    # Partners
    path('partners', views.PartnerListView.as_view(), name='partner-list'),

    # Site Settings (Hero, Video, Featured Story)
    path('site-settings', views.SiteSettingsView.as_view(), name='site-settings'),

    # Implementation Progress (S-curve data)
    path('implementation-progress', views.ImplementationProgressView.as_view(), name='implementation-progress'),

    # Gallery
    path('gallery', views.GalleryListView.as_view(), name='gallery-list'),

    # Featured Story
    path('stories/featured', views.FeaturedStoryView.as_view(), name='featured-story'),

    # Revalidation webhook
    path('revalidate', views.RevalidateView.as_view(), name='revalidate'),
]
