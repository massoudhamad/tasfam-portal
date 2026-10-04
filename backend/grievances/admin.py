"""
Grievance admin - with role-based access for sensitive cases.
GBV cases visible only to GBV Focal Point and Project Coordinator.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.db.models import Q
from .models import Case, CaseEvent, CaseAttachment


class CaseEventInline(admin.TabularInline):
    """Read-only timeline of case events."""
    model = CaseEvent
    extra = 0
    readonly_fields = ['timestamp', 'actor', 'event_type', 'note', 'visible_to_complainant']
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


class CaseAttachmentInline(admin.TabularInline):
    """Case attachments - view only in admin."""
    model = CaseAttachment
    extra = 0
    readonly_fields = ['original_filename', 'file_size_display', 'scan_status', 'uploaded_at']
    fields = ['original_filename', 'file', 'file_size_display', 'scan_status', 'uploaded_at']
    can_delete = False

    def file_size_display(self, obj):
        if obj.file_size > 1024 * 1024:
            return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return f"{obj.file_size / 1024:.1f} KB"
    file_size_display.short_description = 'Size'

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    """
    Grievance case admin with role-based filtering.
    Sensitive cases (GBV/SEA/SH) are hidden from all users except:
    - GBV Focal Point
    - Project Coordinator
    """
    list_display = [
        'reference', 'category_display', 'district', 'status_display',
        'severity_display', 'created_at', 'due_at_display', 'assigned_to'
    ]
    list_filter = ['status', 'category', 'severity', 'district', 'channel', 'created_at']
    search_fields = ['reference', 'description', 'district', 'shehia']
    readonly_fields = [
        'reference', 'created_at', 'updated_at', 'is_sensitive',
        'passphrase_hash', 'acknowledged_at', 'resolved_at'
    ]
    date_hierarchy = 'created_at'
    raw_id_fields = ['sub_project', 'assigned_to']
    inlines = [CaseEventInline, CaseAttachmentInline]

    fieldsets = (
        ('Case Information', {
            'fields': ('reference', 'category', 'sub_category', 'is_sensitive', 'channel')
        }),
        ('Complainant', {
            'fields': ('is_anonymous', 'complainant_name', 'complainant_phone', 'complainant_email', 'preferred_language'),
            'description': 'Complainant details are encrypted at rest in production.'
        }),
        ('Location', {
            'fields': ('district', 'shehia', 'sub_project')
        }),
        ('Description', {
            'fields': ('description', 'occurred_on')
        }),
        ('Status & Assignment', {
            'fields': ('status', 'severity', 'assigned_to', 'due_at')
        }),
        ('Resolution', {
            'fields': ('resolution_summary', 'satisfaction', 'appeal_flag'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'acknowledged_at', 'resolved_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['acknowledge_cases', 'assign_to_me']

    def get_queryset(self, request):
        """
        Filter sensitive cases based on user role.
        Only GBV Focal Point and Coordinator can see sensitive cases.
        """
        qs = super().get_queryset(request)

        # Superusers see everything
        if request.user.is_superuser:
            return qs

        # Check user role
        try:
            role = request.user.staff_role.role
            if role in ['gbv_focal', 'coordinator']:
                return qs  # Can see all cases including sensitive
        except:
            pass

        # Others cannot see sensitive cases
        return qs.filter(is_sensitive=False)

    def category_display(self, obj):
        if obj.is_sensitive:
            return format_html(
                '<span style="color: #DC2626; font-weight: bold;">{}</span>',
                obj.get_category_display()
            )
        return obj.get_category_display()
    category_display.short_description = 'Category'

    def status_display(self, obj):
        colors = {
            'received': '#6B7280',
            'acknowledged': '#2563EB',
            'under_review': '#D97706',
            'action_agreed': '#7C3AED',
            'resolved': '#059669',
            'closed': '#10B981',
            'referred': '#0891B2',
            'appealed': '#DC2626',
            'reopened': '#DC2626',
        }
        color = colors.get(obj.status, '#6B7280')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_display.short_description = 'Status'

    def severity_display(self, obj):
        colors = {
            'low': '#10B981',
            'medium': '#F59E0B',
            'high': '#EF4444',
            'critical': '#DC2626',
        }
        color = colors.get(obj.severity, '#6B7280')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_severity_display()
        )
    severity_display.short_description = 'Severity'

    def due_at_display(self, obj):
        if not obj.due_at:
            return '-'
        if obj.is_overdue:
            return format_html(
                '<span style="color: #DC2626; font-weight: bold;">OVERDUE: {}</span>',
                obj.due_at.strftime('%Y-%m-%d')
            )
        if obj.sla_warning:
            return format_html(
                '<span style="color: #F59E0B; font-weight: bold;">{}</span>',
                obj.due_at.strftime('%Y-%m-%d')
            )
        return obj.due_at.strftime('%Y-%m-%d')
    due_at_display.short_description = 'Due Date'

    def acknowledge_cases(self, request, queryset):
        count = 0
        for case in queryset.filter(status='received'):
            case.acknowledge(request.user)
            count += 1
        self.message_user(request, f'{count} cases acknowledged.')
    acknowledge_cases.short_description = 'Acknowledge selected cases'

    def assign_to_me(self, request, queryset):
        count = queryset.update(assigned_to=request.user)
        self.message_user(request, f'{count} cases assigned to you.')
    assign_to_me.short_description = 'Assign to me'

    def has_delete_permission(self, request, obj=None):
        # Only superusers can delete cases
        return request.user.is_superuser

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Log to audit trail
        from core.models import AuditLog
        AuditLog.log(
            actor=request.user,
            action='update' if change else 'create',
            model_name='Case',
            object_id=obj.id,
            request=request,
            is_sensitive=obj.is_sensitive
        )


@admin.register(CaseEvent)
class CaseEventAdmin(admin.ModelAdmin):
    """Read-only view of case events."""
    list_display = ['case', 'event_type', 'actor', 'visible_to_complainant', 'timestamp']
    list_filter = ['event_type', 'visible_to_complainant', 'timestamp']
    search_fields = ['case__reference', 'note']
    readonly_fields = ['id', 'case', 'actor', 'event_type', 'note', 'visible_to_complainant', 'timestamp']
    date_hierarchy = 'timestamp'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CaseAttachment)
class CaseAttachmentAdmin(admin.ModelAdmin):
    """Read-only view of case attachments."""
    list_display = ['case', 'original_filename', 'file_size_display', 'scan_status', 'uploaded_at']
    list_filter = ['scan_status', 'uploaded_at']
    search_fields = ['case__reference', 'original_filename']
    readonly_fields = ['id', 'case', 'file', 'original_filename', 'file_size', 'mime_type', 'scan_status', 'scan_result', 'uploaded_by', 'uploaded_at']

    def file_size_display(self, obj):
        if obj.file_size > 1024 * 1024:
            return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return f"{obj.file_size / 1024:.1f} KB"
    file_size_display.short_description = 'Size'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
