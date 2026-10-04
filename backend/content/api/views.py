"""Content API views."""
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.core.serializers import serialize
import json

from content.models import (
    NewsItem, Publication, Tender, ProjectComponent,
    SubProject, Story, Partner, SiteSettings,
    ImplementationProgress, GalleryImage, MediaAsset
)


class NewsListView(generics.ListAPIView):
    """List published news items with filtering."""
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = NewsItem.objects.filter(status='published')
        category = self.request.query_params.get('category')
        year = self.request.query_params.get('year')
        if category:
            qs = qs.filter(category=category)
        if year:
            qs = qs.filter(date__year=year)
        return qs.order_by('-date')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        lang = request.query_params.get('lang', 'en')

        data = []
        for item in queryset[:20]:
            data.append({
                'id': str(item.id),
                'slug': item.slug,
                'title': item.title_sw if lang == 'sw' and item.title_sw else item.title,
                'summary': item.summary_sw if lang == 'sw' and item.summary_sw else item.summary,
                'date': item.date.isoformat(),
                'category': item.category,
                'is_featured': item.is_featured,
                'hero_image': item.hero_image.file.url if item.hero_image else None,
            })

        return Response(data)


class NewsDetailView(generics.RetrieveAPIView):
    """Get single news item."""
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return NewsItem.objects.filter(status='published')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        lang = request.query_params.get('lang', 'en')

        return Response({
            'id': str(instance.id),
            'slug': instance.slug,
            'title': instance.title_sw if lang == 'sw' and instance.title_sw else instance.title,
            'summary': instance.summary_sw if lang == 'sw' and instance.summary_sw else instance.summary,
            'body': instance.body_sw if lang == 'sw' and instance.body_sw else instance.body,
            'date': instance.date.isoformat(),
            'category': instance.category,
            'tags': instance.tags,
            'hero_image': instance.hero_image.file.url if instance.hero_image else None,
            'gallery': [img.file.url for img in instance.gallery.all()],
        })


class PublicationListView(generics.ListAPIView):
    """List published publications."""
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Publication.objects.filter(status='published')
        doc_type = self.request.query_params.get('type')
        year = self.request.query_params.get('year')
        safeguards = self.request.query_params.get('safeguards')
        if doc_type:
            qs = qs.filter(doc_type=doc_type)
        if year:
            qs = qs.filter(disclosure_date__year=year)
        if safeguards == 'true':
            qs = qs.filter(is_safeguard=True)
        return qs.order_by('-disclosure_date')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        lang = request.query_params.get('lang', 'en')

        data = []
        for pub in queryset[:50]:
            data.append({
                'id': str(pub.id),
                'slug': pub.slug,
                'title': pub.title_sw if lang == 'sw' and pub.title_sw else pub.title,
                'description': pub.description_sw if lang == 'sw' and pub.description_sw else pub.description,
                'doc_type': pub.doc_type,
                'file_url': pub.file.url,
                'file_size': pub.file_size,
                'page_count': pub.page_count,
                'disclosure_date': pub.disclosure_date.isoformat(),
                'is_safeguard': pub.is_safeguard,
                'version': pub.version,
            })

        return Response(data)


class TenderListView(generics.ListAPIView):
    """List published tenders."""
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Tender.objects.filter(status='published')
        tender_status = self.request.query_params.get('tender_status')
        category = self.request.query_params.get('category')
        if tender_status:
            qs = qs.filter(tender_status=tender_status)
        if category:
            qs = qs.filter(category=category)
        return qs.order_by('-issue_date')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        lang = request.query_params.get('lang', 'en')

        data = []
        for tender in queryset[:50]:
            docs = []
            for doc in tender.documents.all():
                docs.append({
                    'name': doc.name_sw if lang == 'sw' and doc.name_sw else doc.name,
                    'url': doc.file.url,
                    'size': doc.file_size,
                })

            data.append({
                'id': str(tender.id),
                'slug': tender.slug,
                'reference_no': tender.reference_no,
                'title': tender.title_sw if lang == 'sw' and tender.title_sw else tender.title,
                'description': tender.description_sw if lang == 'sw' and tender.description_sw else tender.description,
                'category': tender.category,
                'procurement_method': tender.procurement_method,
                'issue_date': tender.issue_date.isoformat(),
                'closing_datetime': tender.closing_datetime.isoformat(),
                'tender_status': tender.tender_status,
                'award_supplier': tender.award_supplier,
                'award_amount': str(tender.award_amount) if tender.award_amount else None,
                'award_date': tender.award_date.isoformat() if tender.award_date else None,
                'documents': docs,
            })

        return Response(data)


class TenderDetailView(generics.RetrieveAPIView):
    """Get single tender with documents."""
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Tender.objects.filter(status='published')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        lang = request.query_params.get('lang', 'en')

        docs = []
        for doc in instance.documents.all():
            docs.append({
                'name': doc.name_sw if lang == 'sw' and doc.name_sw else doc.name,
                'url': doc.file.url,
                'size': doc.file_size,
            })

        return Response({
            'id': str(instance.id),
            'slug': instance.slug,
            'reference_no': instance.reference_no,
            'title': instance.title_sw if lang == 'sw' and instance.title_sw else instance.title,
            'description': instance.description_sw if lang == 'sw' and instance.description_sw else instance.description,
            'category': instance.category,
            'procurement_method': instance.procurement_method,
            'issue_date': instance.issue_date.isoformat(),
            'closing_datetime': instance.closing_datetime.isoformat(),
            'tender_status': instance.tender_status,
            'award_supplier': instance.award_supplier,
            'award_amount': str(instance.award_amount) if instance.award_amount else None,
            'award_date': instance.award_date.isoformat() if instance.award_date else None,
            'documents': docs,
        })


class ComponentListView(generics.ListAPIView):
    """List project components."""
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        lang = request.query_params.get('lang', 'en')
        components = ProjectComponent.objects.all().order_by('number')

        data = []
        for comp in components:
            data.append({
                'number': comp.number,
                'title': comp.title_sw if lang == 'sw' and comp.title_sw else comp.title,
                'summary': comp.summary_sw if lang == 'sw' and comp.summary_sw else comp.summary,
                'allocation_usd': str(comp.allocation_usd),
                'allocation_share': str(comp.allocation_share),
                'start_year': comp.start_year,
                'end_year': comp.end_year,
            })

        return Response(data)


class SubProjectListView(generics.ListAPIView):
    """List sub-projects with filtering."""
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        lang = request.query_params.get('lang', 'en')
        qs = SubProject.objects.all()

        # Filters
        component = request.query_params.get('component')
        island = request.query_params.get('island')
        status_filter = request.query_params.get('status')
        district = request.query_params.get('district')

        if component:
            qs = qs.filter(component__number=component)
        if island:
            qs = qs.filter(island=island)
        if status_filter:
            qs = qs.filter(status=status_filter)
        if district:
            qs = qs.filter(district=district)

        data = []
        for sp in qs:
            data.append({
                'id': str(sp.id),
                'slug': sp.slug,
                'name': sp.name_sw if lang == 'sw' and sp.name_sw else sp.name,
                'description': sp.description_sw if lang == 'sw' and sp.description_sw else sp.description,
                'component': sp.component.number,
                'district': sp.district,
                'island': sp.island,
                'status': sp.status,
                'budget_usd': str(sp.budget_usd) if sp.budget_usd else None,
                'physical_progress_pct': str(sp.physical_progress_pct),
                'coordinates': [sp.point.x, sp.point.y] if sp.point else None,
            })

        return Response(data)


class SubProjectGeoJSONView(APIView):
    """GeoJSON endpoint for sub-projects (for map)."""
    permission_classes = [AllowAny]

    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        sub_projects = SubProject.objects.filter(point__isnull=False)

        features = []
        for sp in sub_projects:
            features.append({
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [sp.point.x, sp.point.y]
                },
                'properties': {
                    'id': str(sp.id),
                    'name': sp.name_sw if lang == 'sw' and sp.name_sw else sp.name,
                    'component': sp.component.number,
                    'district': sp.district,
                    'island': sp.island,
                    'status': sp.status,
                    'progress': float(sp.physical_progress_pct),
                }
            })

        return Response({
            'type': 'FeatureCollection',
            'features': features
        })


class StoryListView(generics.ListAPIView):
    """List published stories."""
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Story.objects.filter(status='published', consent_on_file=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        lang = request.query_params.get('lang', 'en')

        data = []
        for story in queryset[:20]:
            data.append({
                'id': str(story.id),
                'slug': story.slug,
                'headline': story.headline_sw if lang == 'sw' and story.headline_sw else story.headline,
                'pull_quote': story.pull_quote_sw if lang == 'sw' and story.pull_quote_sw else story.pull_quote,
                'subject_name': story.subject_name,
                'subject_role': story.subject_role,
                'location': story.location,
                'photo': story.photos.first().file.url if story.photos.exists() else None,
            })

        return Response(data)


class StoryDetailView(generics.RetrieveAPIView):
    """Get single story."""
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Story.objects.filter(status='published', consent_on_file=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        lang = request.query_params.get('lang', 'en')

        return Response({
            'id': str(instance.id),
            'slug': instance.slug,
            'headline': instance.headline_sw if lang == 'sw' and instance.headline_sw else instance.headline,
            'pull_quote': instance.pull_quote_sw if lang == 'sw' and instance.pull_quote_sw else instance.pull_quote,
            'body': instance.body_sw if lang == 'sw' and instance.body_sw else instance.body,
            'subject_name': instance.subject_name,
            'subject_role': instance.subject_role,
            'location': instance.location,
            'photos': [p.file.url for p in instance.photos.all()],
        })


class PartnerListView(generics.ListAPIView):
    """List partners."""
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        lang = request.query_params.get('lang', 'en')
        partners = Partner.objects.filter(is_active=True)

        data = []
        for partner in partners:
            data.append({
                'id': str(partner.id),
                'name': partner.name_sw if lang == 'sw' and partner.name_sw else partner.name,
                'abbreviation': partner.abbreviation,
                'role': partner.role,
                'logo': partner.logo.file.url if partner.logo else None,
                'url': partner.url,
                'description': partner.description_sw if lang == 'sw' and partner.description_sw else partner.description,
            })

        return Response(data)


class RevalidateView(APIView):
    """
    Webhook to trigger Next.js ISR revalidation.
    Called by Django admin when content is published.
    """
    def post(self, request):
        # Verify signature (implement in production)
        # signature = request.headers.get('X-Signature')

        paths = request.data.get('paths', [])

        # In production, call Next.js revalidate API
        # import requests
        # for path in paths:
        #     requests.post(f"{NEXTJS_URL}/api/revalidate", json={'path': path, 'secret': REVALIDATE_SECRET})

        return Response({'status': 'ok', 'revalidated': paths})


class SiteSettingsView(APIView):
    """Get site settings (hero, video, featured story, etc.)."""
    permission_classes = [AllowAny]

    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        settings = SiteSettings.get_settings()

        # Get featured story data
        featured_story = None
        if settings.featured_story and settings.featured_story.status == 'published':
            story = settings.featured_story
            featured_story = {
                'id': str(story.id),
                'slug': story.slug,
                'headline': story.headline_sw if lang == 'sw' and story.headline_sw else story.headline,
                'pull_quote': story.pull_quote_sw if lang == 'sw' and story.pull_quote_sw else story.pull_quote,
                'subject_name': story.subject_name,
                'subject_role': story.subject_role,
                'location': story.location,
                'photo': story.photos.first().file.url if story.photos.exists() else None,
            }

        return Response({
            'hero': {
                'title': settings.hero_title_sw if lang == 'sw' and settings.hero_title_sw else settings.hero_title,
                'subtitle': settings.hero_subtitle_sw if lang == 'sw' and settings.hero_subtitle_sw else settings.hero_subtitle,
                'image': settings.hero_image.file.url if settings.hero_image else None,
                'cta_text': settings.hero_cta_text_sw if lang == 'sw' and settings.hero_cta_text_sw else settings.hero_cta_text,
                'cta_link': settings.hero_cta_link,
            },
            'video': {
                'url': settings.video_url,
                'title': settings.video_title_sw if lang == 'sw' and settings.video_title_sw else settings.video_title,
                'description': settings.video_description_sw if lang == 'sw' and settings.video_description_sw else settings.video_description,
                'thumbnail': settings.video_thumbnail.file.url if settings.video_thumbnail else None,
            },
            'featured_story': featured_story,
            'impact': {
                'title': settings.impact_title_sw if lang == 'sw' and settings.impact_title_sw else settings.impact_title,
                'subtitle': settings.impact_subtitle_sw if lang == 'sw' and settings.impact_subtitle_sw else settings.impact_subtitle,
            },
        })


class ImplementationProgressView(APIView):
    """Get implementation progress data for S-curve chart."""
    permission_classes = [AllowAny]

    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        progress_data = ImplementationProgress.objects.all()

        data = []
        for item in progress_data:
            data.append({
                'fiscal_year': item.fiscal_year,
                'planned': float(item.planned_progress),
                'actual': float(item.actual_progress) if item.actual_progress is not None else None,
                'notes': item.notes_sw if lang == 'sw' and item.notes_sw else item.notes,
            })

        return Response(data)


class GalleryListView(APIView):
    """List gallery images."""
    permission_classes = [AllowAny]

    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        category = request.query_params.get('category')

        qs = GalleryImage.objects.filter(is_active=True).select_related('image')
        if category:
            qs = qs.filter(category=category)

        data = []
        for item in qs:
            img = item.image
            data.append({
                'id': str(img.id),
                'url': img.file.url,
                'alt': img.alt_text_sw if lang == 'sw' and img.alt_text_sw else img.alt_text,
                'caption': img.caption_sw if lang == 'sw' and img.caption_sw else img.caption,
                'credit': img.credit,
                'category': item.category,
            })

        return Response(data)


class FeaturedStoryView(APIView):
    """Get the featured story from site settings."""
    permission_classes = [AllowAny]

    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        settings = SiteSettings.get_settings()

        if not settings.featured_story or settings.featured_story.status != 'published':
            return Response(None)

        story = settings.featured_story
        return Response({
            'id': str(story.id),
            'slug': story.slug,
            'headline': story.headline_sw if lang == 'sw' and story.headline_sw else story.headline,
            'pull_quote': story.pull_quote_sw if lang == 'sw' and story.pull_quote_sw else story.pull_quote,
            'body': story.body_sw if lang == 'sw' and story.body_sw else story.body,
            'subject_name': story.subject_name,
            'subject_role': story.subject_role,
            'location': story.location,
            'photo': story.photos.first().file.url if story.photos.exists() else None,
        })
