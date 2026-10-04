"""Content models for TASFAM portal - News, Publications, Tenders, Stories, Media."""
import os
import uuid
from django.db import models
from django.core.validators import FileExtensionValidator
from core.models import BaseContent, ContentStatus
from core.utils import (
    media_upload_path,
    document_upload_path,
    tender_upload_path,
    validate_file_size,
    validate_file_type,
)

# Conditionally import GIS models
USE_GIS = os.environ.get('USE_SQLITE', 'true').lower() != 'true'
if USE_GIS:
    from django.contrib.gis.db import models as gis_models


class MediaAsset(models.Model):
    """
    Media library for images, videos, and logos.
    Alt text required for accessibility compliance.
    """
    class MediaType(models.TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'
        LOGO = 'logo', 'Logo'
        DOCUMENT = 'document', 'Document'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(
        upload_to=media_upload_path,
        validators=[FileExtensionValidator(
            allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'webm', 'pdf']
        )]
    )
    media_type = models.CharField(max_length=20, choices=MediaType.choices, db_index=True)

    # Translations
    alt_text = models.CharField(max_length=500, help_text='Alt text in English (required for accessibility)')
    alt_text_sw = models.CharField(max_length=500, blank=True, help_text='Alt text in Kiswahili')
    caption = models.TextField(blank=True, help_text='Caption in English')
    caption_sw = models.TextField(blank=True, help_text='Caption in Kiswahili')

    credit = models.CharField(max_length=255, blank=True)
    taken_on = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    consent_reference = models.CharField(
        max_length=100,
        blank=True,
        help_text='Consent form reference for identifiable people'
    )

    # Metadata
    file_size = models.PositiveIntegerField(default=0, editable=False)
    mime_type = models.CharField(max_length=100, blank=True, editable=False)
    width = models.PositiveIntegerField(null=True, blank=True, editable=False)
    height = models.PositiveIntegerField(null=True, blank=True, editable=False)
    duration = models.PositiveIntegerField(null=True, blank=True, help_text='Duration in seconds for videos')

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='media_assets'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Media Asset'
        verbose_name_plural = 'Media Library'

    def __str__(self):
        return f"{self.get_media_type_display()}: {self.alt_text[:50]}"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class NewsItem(BaseContent):
    """News articles, events, and press releases."""
    class Category(models.TextChoices):
        NEWS = 'news', 'News'
        EVENT = 'event', 'Event'
        PRESS = 'press', 'Press Release'

    # Translations
    title = models.CharField(max_length=255)
    title_sw = models.CharField(max_length=255, blank=True, verbose_name='Title (Kiswahili)')
    summary = models.TextField(max_length=500)
    summary_sw = models.TextField(max_length=500, blank=True, verbose_name='Summary (Kiswahili)')
    body = models.TextField()
    body_sw = models.TextField(blank=True, verbose_name='Body (Kiswahili)')

    date = models.DateField(db_index=True)
    category = models.CharField(max_length=20, choices=Category.choices, db_index=True)

    hero_image = models.ForeignKey(
        MediaAsset,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='news_hero'
    )
    gallery = models.ManyToManyField(MediaAsset, blank=True, related_name='news_gallery')

    tags = models.CharField(max_length=500, blank=True, help_text='Comma-separated tags')
    is_featured = models.BooleanField(default=False, db_index=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'News Item'
        verbose_name_plural = 'News'

    def __str__(self):
        return self.title


class Publication(BaseContent):
    """
    Publications library - reports, safeguards documents, guidelines.
    Supports versioning with supersedes relationship.
    """
    class DocType(models.TextChoices):
        REPORT = 'report', 'Report'
        ESMF = 'esmf', 'ESMF'
        RPF = 'rpf', 'RPF'
        SEP = 'sep', 'SEP'
        ESMP = 'esmp', 'ESMP'
        RAP = 'rap', 'RAP'
        AUDIT = 'audit', 'Audit'
        PLAN = 'plan', 'Plan'
        GUIDELINE = 'guideline', 'Guideline'

    # Translations
    title = models.CharField(max_length=255)
    title_sw = models.CharField(max_length=255, blank=True, verbose_name='Title (Kiswahili)')
    description = models.TextField()
    description_sw = models.TextField(blank=True, verbose_name='Description (Kiswahili)')

    doc_type = models.CharField(max_length=20, choices=DocType.choices, db_index=True)
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    file_size = models.PositiveIntegerField(default=0, editable=False)
    page_count = models.PositiveIntegerField(null=True, blank=True)
    file_language = models.CharField(max_length=50, default='English')

    disclosure_date = models.DateField(db_index=True)
    version = models.CharField(max_length=50, default='1.0')
    supersedes = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='superseded_by'
    )

    is_safeguard = models.BooleanField(
        default=False,
        db_index=True,
        help_text='Is this a safeguards document (ESMF, RPF, SEP, etc.)?'
    )

    class Meta:
        ordering = ['-disclosure_date', '-created_at']
        verbose_name = 'Publication'
        verbose_name_plural = 'Publications'

    def __str__(self):
        return f"{self.get_doc_type_display()}: {self.title}"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        # Auto-set is_safeguard based on doc_type
        safeguard_types = [self.DocType.ESMF, self.DocType.RPF, self.DocType.SEP, self.DocType.ESMP, self.DocType.RAP]
        self.is_safeguard = self.doc_type in safeguard_types
        super().save(*args, **kwargs)


class Tender(BaseContent):
    """
    Procurement notices and contract awards.
    Procurement officers can upload tender documents.
    """
    class Category(models.TextChoices):
        GOODS = 'goods', 'Goods'
        WORKS = 'works', 'Works'
        CONSULTANCY = 'consultancy', 'Consultancy Services'
        NON_CONSULTANCY = 'non_consultancy', 'Non-Consultancy Services'

    class TenderStatus(models.TextChoices):
        OPEN = 'open', 'Open'
        CLOSED = 'closed', 'Closed'
        EVALUATED = 'evaluated', 'Under Evaluation'
        AWARDED = 'awarded', 'Awarded'
        CANCELLED = 'cancelled', 'Cancelled'

    reference_no = models.CharField(max_length=50, unique=True, db_index=True)

    # Translations
    title = models.CharField(max_length=255)
    title_sw = models.CharField(max_length=255, blank=True, verbose_name='Title (Kiswahili)')
    description = models.TextField()
    description_sw = models.TextField(blank=True, verbose_name='Description (Kiswahili)')

    category = models.CharField(max_length=20, choices=Category.choices, db_index=True)
    procurement_method = models.CharField(
        max_length=50,
        help_text='e.g., NCB, ICB, QCBS, CQS'
    )

    issue_date = models.DateField(db_index=True)
    closing_datetime = models.DateTimeField(db_index=True)
    tender_status = models.CharField(
        max_length=20,
        choices=TenderStatus.choices,
        default=TenderStatus.OPEN,
        db_index=True
    )

    # Award information
    award_supplier = models.CharField(max_length=255, blank=True)
    award_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True
    )
    award_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-issue_date', '-created_at']
        verbose_name = 'Tender'
        verbose_name_plural = 'Tenders'

    def __str__(self):
        return f"{self.reference_no}: {self.title}"


class TenderDocument(models.Model):
    """Tender documents - bidding docs, specifications, contract notices."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tender = models.ForeignKey(Tender, on_delete=models.CASCADE, related_name='documents')

    name = models.CharField(max_length=255)
    name_sw = models.CharField(max_length=255, blank=True)
    file = models.FileField(
        upload_to=tender_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'xls', 'xlsx'])]
    )
    file_size = models.PositiveIntegerField(default=0, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='tender_documents'
    )

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.tender.reference_no} - {self.name}"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class Story(BaseContent):
    """Field stories with consent tracking for identifiable people."""
    # Translations
    headline = models.CharField(max_length=255)
    headline_sw = models.CharField(max_length=255, blank=True, verbose_name='Headline (Kiswahili)')
    pull_quote = models.TextField(max_length=500)
    pull_quote_sw = models.TextField(max_length=500, blank=True, verbose_name='Pull Quote (Kiswahili)')
    body = models.TextField()
    body_sw = models.TextField(blank=True, verbose_name='Body (Kiswahili)')

    subject_name = models.CharField(max_length=255)
    subject_role = models.CharField(max_length=255, help_text='e.g., Fisher, Seaweed Farmer')
    location = models.CharField(max_length=255)

    consent_on_file = models.BooleanField(
        default=False,
        help_text='Required to be True before publishing'
    )
    consent_reference = models.CharField(max_length=100, blank=True)

    photos = models.ManyToManyField(MediaAsset, blank=True, related_name='stories')
    related_component = models.ForeignKey(
        'ProjectComponent',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Story'
        verbose_name_plural = 'Stories'

    def __str__(self):
        return self.headline

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.status == ContentStatus.PUBLISHED and not self.consent_on_file:
            raise ValidationError('Cannot publish story without consent on file.')


class Partner(models.Model):
    """Funding and implementing partners."""
    class Role(models.TextChoices):
        FUNDER = 'funder', 'Funder'
        IMPLEMENTING = 'implementing', 'Implementing Agency'
        PARTNER = 'partner', 'Partner'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    name_sw = models.CharField(max_length=255, blank=True)
    abbreviation = models.CharField(max_length=50, blank=True)

    role = models.CharField(max_length=20, choices=Role.choices)
    logo = models.ForeignKey(
        MediaAsset,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='partner_logos'
    )
    url = models.URLField(blank=True)

    description = models.TextField(blank=True)
    description_sw = models.TextField(blank=True)

    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class ProjectComponent(models.Model):
    """Project components (1-4) with allocation and timeline."""
    number = models.PositiveIntegerField(unique=True)

    title = models.CharField(max_length=255)
    title_sw = models.CharField(max_length=255, blank=True)
    summary = models.TextField()
    summary_sw = models.TextField(blank=True)
    body = models.TextField(blank=True)
    body_sw = models.TextField(blank=True)

    allocation_usd = models.DecimalField(max_digits=15, decimal_places=2)
    allocation_share = models.DecimalField(max_digits=5, decimal_places=2, help_text='Percentage of total budget')

    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField()

    implementing_agency = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f"Component {self.number}: {self.title}"


class SubProject(models.Model):
    """Sub-projects with GIS location data."""
    class Island(models.TextChoices):
        UNGUJA = 'unguja', 'Unguja'
        PEMBA = 'pemba', 'Pemba'
        MAINLAND = 'mainland', 'Mainland Coast'

    class Status(models.TextChoices):
        PLANNED = 'planned', 'Planned'
        ACTIVE = 'active', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        SUSPENDED = 'suspended', 'Suspended'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=255, unique=True)

    name = models.CharField(max_length=255)
    name_sw = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    description_sw = models.TextField(blank=True)

    component = models.ForeignKey(ProjectComponent, on_delete=models.PROTECT, related_name='sub_projects')
    district = models.CharField(max_length=100, db_index=True)
    shehia = models.CharField(max_length=100, blank=True)
    island = models.CharField(max_length=20, choices=Island.choices, db_index=True)

    # Location fields - use GIS in production, lat/lng in development
    if USE_GIS:
        point = gis_models.PointField(null=True, blank=True, srid=4326)
        area = gis_models.PolygonField(null=True, blank=True, srid=4326)
    else:
        latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
        longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED, db_index=True)
    budget_usd = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    physical_progress_pct = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text='Physical progress percentage (0-100)'
    )

    start_date = models.DateField(null=True, blank=True)
    expected_completion = models.DateField(null=True, blank=True)

    photos = models.ManyToManyField(MediaAsset, blank=True, related_name='sub_projects')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['component', 'name']

    def __str__(self):
        return f"{self.name} ({self.district})"


class SiteSettings(models.Model):
    """
    Singleton model for site-wide settings.
    Manages Hero content, Video URL, Featured Story, and other homepage settings.
    """
    # Hero Section
    hero_title = models.CharField(max_length=255, default='Sustainable Fisheries for Tanzania')
    hero_title_sw = models.CharField(max_length=255, blank=True)
    hero_subtitle = models.TextField(default='Empowering coastal communities through sustainable fisheries management')
    hero_subtitle_sw = models.TextField(blank=True)
    hero_image = models.ForeignKey(
        MediaAsset,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='hero_settings'
    )
    hero_cta_text = models.CharField(max_length=100, default='Learn More')
    hero_cta_text_sw = models.CharField(max_length=100, blank=True)
    hero_cta_link = models.CharField(max_length=255, default='/about')

    # Video Section
    video_url = models.URLField(blank=True, help_text='YouTube or Vimeo embed URL')
    video_title = models.CharField(max_length=255, blank=True)
    video_title_sw = models.CharField(max_length=255, blank=True)
    video_description = models.TextField(blank=True)
    video_description_sw = models.TextField(blank=True)
    video_thumbnail = models.ForeignKey(
        MediaAsset,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='video_thumbnail_settings'
    )

    # Featured Story
    featured_story = models.ForeignKey(
        'Story',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='featured_in_settings'
    )

    # Impact Section header
    impact_title = models.CharField(max_length=255, default='Our Impact')
    impact_title_sw = models.CharField(max_length=255, blank=True)
    impact_subtitle = models.TextField(blank=True)
    impact_subtitle_sw = models.TextField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return 'Site Settings'

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance."""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class ImplementationProgress(models.Model):
    """
    Implementation progress data for S-curve chart.
    Stores planned and actual progress by fiscal year.
    """
    fiscal_year = models.CharField(max_length=10, unique=True, help_text='e.g., FY25, FY26')
    display_order = models.PositiveIntegerField(default=0)

    planned_progress = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text='Planned cumulative progress percentage (0-100)'
    )
    actual_progress = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Actual cumulative progress percentage (0-100)'
    )

    notes = models.TextField(blank=True)
    notes_sw = models.TextField(blank=True)

    class Meta:
        ordering = ['display_order', 'fiscal_year']
        verbose_name = 'Implementation Progress'
        verbose_name_plural = 'Implementation Progress'

    def __str__(self):
        return f"{self.fiscal_year}: Planned {self.planned_progress}%, Actual {self.actual_progress or 'N/A'}%"


class GalleryImage(models.Model):
    """
    Gallery images for homepage and gallery page.
    Ordered display with optional category.
    """
    class Category(models.TextChoices):
        HOMEPAGE = 'homepage', 'Homepage Gallery'
        GENERAL = 'general', 'General Gallery'
        FISHERIES = 'fisheries', 'Fisheries'
        AQUACULTURE = 'aquaculture', 'Aquaculture'
        COMMUNITY = 'community', 'Community'
        INFRASTRUCTURE = 'infrastructure', 'Infrastructure'

    image = models.ForeignKey(
        MediaAsset,
        on_delete=models.CASCADE,
        related_name='gallery_entries'
    )
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.GENERAL,
        db_index=True
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', '-image__created_at']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'

    def __str__(self):
        return f"{self.get_category_display()}: {self.image.alt_text[:50]}"
