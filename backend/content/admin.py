"""Content admin - CMS for News, Publications, Tenders, Stories, Media."""
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import (
    MediaAsset, NewsItem, Publication, Tender, TenderDocument,
    Story, Partner, ProjectComponent, SubProject,
    SiteSettings, ImplementationProgress, GalleryImage
)


class TenderDocumentInline(admin.TabularInline):
    """Inline for tender documents - allows Procurement Officer to upload docs."""
    model = TenderDocument
    extra = 1
    fields = ['name', 'name_sw', 'file', 'file_size']
    readonly_fields = ['file_size']


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    """Media library admin - for uploading videos, images, logos."""
    list_display = ['preview', 'alt_text', 'media_type', 'file_size_display', 'created_at', 'created_by']
    list_filter = ['media_type', 'created_at']
    search_fields = ['alt_text', 'alt_text_sw', 'caption']
    readonly_fields = ['id', 'file_size', 'mime_type', 'width', 'height', 'created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('File', {
            'fields': ('file', 'media_type')
        }),
        ('Accessibility (Required)', {
            'fields': ('alt_text', 'alt_text_sw'),
            'description': 'Alt text is required for accessibility compliance (WCAG 2.1 AA).'
        }),
        ('Caption & Credit', {
            'fields': ('caption', 'caption_sw', 'credit', 'taken_on', 'location')
        }),
        ('Consent', {
            'fields': ('consent_reference',),
            'description': 'Required for photos showing identifiable people.'
        }),
        ('Metadata', {
            'fields': ('id', 'file_size', 'mime_type', 'width', 'height', 'duration', 'created_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )

    def preview(self, obj):
        if obj.media_type in ['image', 'logo']:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.file.url)
        elif obj.media_type == 'video':
            return format_html('<span style="font-size: 24px;">🎬</span>')
        return format_html('<span style="font-size: 24px;">📄</span>')
    preview.short_description = 'Preview'

    def file_size_display(self, obj):
        if obj.file_size > 1024 * 1024:
            return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return f"{obj.file_size / 1024:.1f} KB"
    file_size_display.short_description = 'Size'

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    """News/Events admin with publishing workflow."""
    list_display = ['title', 'category', 'date', 'status', 'is_featured', 'published_at']
    list_filter = ['status', 'category', 'is_featured', 'date']
    search_fields = ['title', 'title_sw', 'summary']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'date'
    raw_id_fields = ['hero_image', 'created_by', 'updated_by']
    filter_horizontal = ['gallery']

    fieldsets = (
        ('Content (English)', {
            'fields': ('title', 'slug', 'summary', 'body')
        }),
        ('Content (Kiswahili)', {
            'fields': ('title_sw', 'summary_sw', 'body_sw'),
            'classes': ('collapse',)
        }),
        ('Details', {
            'fields': ('date', 'category', 'tags', 'is_featured')
        }),
        ('Media', {
            'fields': ('hero_image', 'gallery')
        }),
        ('Publishing', {
            'fields': ('status', 'published_at'),
            'description': 'Set status to Published and save to make visible on site.'
        }),
    )

    actions = ['publish_selected', 'unpublish_selected']

    def publish_selected(self, request, queryset):
        count = 0
        for obj in queryset:
            obj.publish(request.user)
            count += 1
        self.message_user(request, f'{count} items published.')
    publish_selected.short_description = 'Publish selected items'

    def unpublish_selected(self, request, queryset):
        count = queryset.update(status='draft')
        self.message_user(request, f'{count} items unpublished.')
    unpublish_selected.short_description = 'Unpublish selected items'

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    """Publications library admin - reports, safeguards docs."""
    list_display = ['title', 'doc_type', 'version', 'disclosure_date', 'is_safeguard', 'status', 'file_size_display']
    list_filter = ['status', 'doc_type', 'is_safeguard', 'disclosure_date']
    search_fields = ['title', 'title_sw', 'description']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'disclosure_date'
    raw_id_fields = ['supersedes', 'created_by', 'updated_by']

    fieldsets = (
        ('Document (English)', {
            'fields': ('title', 'slug', 'description')
        }),
        ('Document (Kiswahili)', {
            'fields': ('title_sw', 'description_sw'),
            'classes': ('collapse',)
        }),
        ('File', {
            'fields': ('file', 'file_language', 'page_count')
        }),
        ('Classification', {
            'fields': ('doc_type', 'is_safeguard', 'disclosure_date', 'version', 'supersedes')
        }),
        ('Publishing', {
            'fields': ('status', 'published_at')
        }),
    )

    def file_size_display(self, obj):
        if obj.file_size > 1024 * 1024:
            return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return f"{obj.file_size / 1024:.1f} KB"
    file_size_display.short_description = 'Size'

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Tender)
class TenderAdmin(admin.ModelAdmin):
    """
    Tender admin - Procurement Officer uploads tender documents here.
    """
    list_display = ['reference_no', 'title', 'category', 'tender_status', 'issue_date', 'closing_datetime', 'document_count']
    list_filter = ['tender_status', 'category', 'issue_date']
    search_fields = ['reference_no', 'title', 'title_sw', 'description']
    prepopulated_fields = {'slug': ('reference_no',)}
    date_hierarchy = 'issue_date'
    inlines = [TenderDocumentInline]

    fieldsets = (
        ('Reference', {
            'fields': ('reference_no', 'slug')
        }),
        ('Details (English)', {
            'fields': ('title', 'description')
        }),
        ('Details (Kiswahili)', {
            'fields': ('title_sw', 'description_sw'),
            'classes': ('collapse',)
        }),
        ('Procurement', {
            'fields': ('category', 'procurement_method', 'issue_date', 'closing_datetime', 'tender_status')
        }),
        ('Award Information', {
            'fields': ('award_supplier', 'award_amount', 'award_date'),
            'classes': ('collapse',),
            'description': 'Fill in when tender is awarded.'
        }),
        ('Publishing', {
            'fields': ('status', 'published_at')
        }),
    )

    def document_count(self, obj):
        count = obj.documents.count()
        return format_html('<a href="{}?tender__id__exact={}">{} documents</a>',
            '/admin/content/tenderdocument/',
            obj.id,
            count
        )
    document_count.short_description = 'Documents'

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(TenderDocument)
class TenderDocumentAdmin(admin.ModelAdmin):
    """Tender document admin - for Procurement Officer uploads."""
    list_display = ['tender', 'name', 'file_size_display', 'created_at', 'uploaded_by']
    list_filter = ['created_at', 'tender__category']
    search_fields = ['name', 'tender__reference_no', 'tender__title']
    raw_id_fields = ['tender']

    def file_size_display(self, obj):
        if obj.file_size > 1024 * 1024:
            return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return f"{obj.file_size / 1024:.1f} KB"
    file_size_display.short_description = 'Size'

    def save_model(self, request, obj, form, change):
        if not change:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    """Stories admin with consent tracking."""
    list_display = ['headline', 'subject_name', 'location', 'consent_on_file', 'status', 'published_at']
    list_filter = ['status', 'consent_on_file', 'related_component']
    search_fields = ['headline', 'headline_sw', 'subject_name', 'location']
    prepopulated_fields = {'slug': ('headline',)}
    raw_id_fields = ['related_component', 'created_by', 'updated_by']
    filter_horizontal = ['photos']

    fieldsets = (
        ('Story (English)', {
            'fields': ('headline', 'slug', 'pull_quote', 'body')
        }),
        ('Story (Kiswahili)', {
            'fields': ('headline_sw', 'pull_quote_sw', 'body_sw'),
            'classes': ('collapse',)
        }),
        ('Subject', {
            'fields': ('subject_name', 'subject_role', 'location')
        }),
        ('Consent', {
            'fields': ('consent_on_file', 'consent_reference'),
            'description': 'Consent MUST be on file before publishing stories with identifiable people.'
        }),
        ('Media', {
            'fields': ('photos', 'related_component')
        }),
        ('Publishing', {
            'fields': ('status', 'published_at')
        }),
    )

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'abbreviation', 'role', 'display_order', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['name', 'name_sw', 'abbreviation']
    raw_id_fields = ['logo']
    ordering = ['display_order', 'name']


@admin.register(ProjectComponent)
class ProjectComponentAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'allocation_usd', 'allocation_share', 'start_year', 'end_year']
    ordering = ['number']

    fieldsets = (
        ('Component (English)', {
            'fields': ('number', 'title', 'summary', 'body')
        }),
        ('Component (Kiswahili)', {
            'fields': ('title_sw', 'summary_sw', 'body_sw'),
            'classes': ('collapse',)
        }),
        ('Budget & Timeline', {
            'fields': ('allocation_usd', 'allocation_share', 'start_year', 'end_year', 'implementing_agency')
        }),
    )


@admin.register(SubProject)
class SubProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'component', 'district', 'island', 'status', 'physical_progress_pct', 'budget_usd']
    list_filter = ['status', 'island', 'component', 'district']
    search_fields = ['name', 'name_sw', 'description', 'district']
    prepopulated_fields = {'slug': ('name',)}
    raw_id_fields = ['component']
    filter_horizontal = ['photos']

    fieldsets = (
        ('Project (English)', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Project (Kiswahili)', {
            'fields': ('name_sw', 'description_sw'),
            'classes': ('collapse',)
        }),
        ('Location', {
            'fields': ('component', 'district', 'shehia', 'island', 'point', 'area')
        }),
        ('Status & Progress', {
            'fields': ('status', 'budget_usd', 'physical_progress_pct', 'start_date', 'expected_completion')
        }),
        ('Media', {
            'fields': ('photos',)
        }),
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Site settings admin - singleton for homepage configuration."""
    list_display = ['__str__', 'updated_at']
    raw_id_fields = ['hero_image', 'video_thumbnail', 'featured_story']

    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_title', 'hero_title_sw', 'hero_subtitle', 'hero_subtitle_sw',
                      'hero_image', 'hero_cta_text', 'hero_cta_text_sw', 'hero_cta_link')
        }),
        ('Video Section', {
            'fields': ('video_url', 'video_title', 'video_title_sw',
                      'video_description', 'video_description_sw', 'video_thumbnail')
        }),
        ('Featured Story', {
            'fields': ('featured_story',),
            'description': 'Select a published story to feature on the homepage.'
        }),
        ('Impact Section', {
            'fields': ('impact_title', 'impact_title_sw', 'impact_subtitle', 'impact_subtitle_sw')
        }),
    )

    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ImplementationProgress)
class ImplementationProgressAdmin(admin.ModelAdmin):
    """Implementation progress admin - for S-curve chart data."""
    list_display = ['fiscal_year', 'planned_progress', 'actual_progress', 'display_order']
    list_editable = ['planned_progress', 'actual_progress', 'display_order']
    ordering = ['display_order', 'fiscal_year']

    fieldsets = (
        (None, {
            'fields': ('fiscal_year', 'display_order')
        }),
        ('Progress', {
            'fields': ('planned_progress', 'actual_progress')
        }),
        ('Notes', {
            'fields': ('notes', 'notes_sw'),
            'classes': ('collapse',)
        }),
    )


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    """Gallery image admin - for homepage and gallery page images."""
    list_display = ['preview', 'category', 'display_order', 'is_active']
    list_filter = ['category', 'is_active']
    list_editable = ['display_order', 'is_active']
    raw_id_fields = ['image']
    ordering = ['display_order']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.image.file.url)
        return '-'
    preview.short_description = 'Preview'
