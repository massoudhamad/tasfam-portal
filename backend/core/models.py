"""Core models and base classes for TASFAM portal."""
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class ContentStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    REVIEW = 'review', 'In Review'
    PUBLISHED = 'published', 'Published'
    ARCHIVED = 'archived', 'Archived'


class BaseContent(models.Model):
    """
    Abstract base model for all content types.
    Provides common fields: UUID, slug, status, timestamps, and audit fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=ContentStatus.choices,
        default=ContentStatus.DRAFT,
        db_index=True
    )
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='%(class)s_created'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='%(class)s_updated'
    )

    class Meta:
        abstract = True
        ordering = ['-published_at', '-created_at']

    def publish(self, user=None):
        """Publish the content."""
        self.status = ContentStatus.PUBLISHED
        self.published_at = timezone.now()
        if user:
            self.updated_by = user
        self.save()

    def unpublish(self, user=None):
        """Unpublish the content."""
        self.status = ContentStatus.DRAFT
        if user:
            self.updated_by = user
        self.save()

    @property
    def is_published(self):
        return self.status == ContentStatus.PUBLISHED


class AuditLog(models.Model):
    """
    Append-only audit log for tracking all changes.
    Required for sensitive operations and grievance case access.
    """
    class Action(models.TextChoices):
        CREATE = 'create', 'Create'
        UPDATE = 'update', 'Update'
        DELETE = 'delete', 'Delete'
        READ = 'read', 'Read'
        LOGIN = 'login', 'Login'
        LOGIN_FAILED = 'login_failed', 'Login Failed'
        EXPORT = 'export', 'Export'
        PUBLISH = 'publish', 'Publish'
        UNPUBLISH = 'unpublish', 'Unpublish'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    actor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=20, choices=Action.choices, db_index=True)
    model_name = models.CharField(max_length=100, db_index=True)
    object_id = models.CharField(max_length=100, db_index=True)
    changes = models.JSONField(default=dict, blank=True)  # Field-level diff
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    is_sensitive = models.BooleanField(default=False)  # For GBV cases

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['model_name', 'object_id']),
            models.Index(fields=['actor', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.action} on {self.model_name} by {self.actor} at {self.timestamp}"

    @classmethod
    def log(cls, actor, action, model_name, object_id, changes=None, request=None, is_sensitive=False):
        """Create an audit log entry."""
        ip_address = None
        user_agent = ''
        if request:
            ip_address = request.META.get('REMOTE_ADDR')
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]

        # Redact sensitive data
        if is_sensitive and changes:
            changes = {k: '[REDACTED]' for k in changes.keys()}

        return cls.objects.create(
            actor=actor,
            action=action,
            model_name=model_name,
            object_id=str(object_id),
            changes=changes or {},
            ip_address=ip_address,
            user_agent=user_agent,
            is_sensitive=is_sensitive
        )


class StaffRole(models.Model):
    """
    Custom roles for TASFAM staff with specific permissions.
    Roles: Communications, Editor, Procurement, M&E, Safeguards, GBV Focal, Coordinator, Admin
    """
    class RoleType(models.TextChoices):
        COMMUNICATIONS = 'communications', 'Communications Officer'
        EDITOR = 'editor', 'Editor/Publisher'
        PROCUREMENT = 'procurement', 'Procurement Officer'
        ME = 'me', 'M&E Officer'
        SAFEGUARDS = 'safeguards', 'Safeguards Officer'
        GBV_FOCAL = 'gbv_focal', 'GBV Focal Point'
        COORDINATOR = 'coordinator', 'Project Coordinator'
        ADMINISTRATOR = 'admin', 'Administrator'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_role')
    role = models.CharField(max_length=20, choices=RoleType.choices)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Staff Role'
        verbose_name_plural = 'Staff Roles'

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.get_role_display()}"

    @property
    def can_access_grievances(self):
        return self.role in [
            self.RoleType.SAFEGUARDS,
            self.RoleType.GBV_FOCAL,
            self.RoleType.COORDINATOR
        ]

    @property
    def can_access_sensitive_cases(self):
        return self.role in [self.RoleType.GBV_FOCAL, self.RoleType.COORDINATOR]

    @property
    def can_publish_content(self):
        return self.role in [
            self.RoleType.EDITOR,
            self.RoleType.COORDINATOR,
            self.RoleType.ADMINISTRATOR
        ]

    @property
    def can_manage_tenders(self):
        return self.role in [
            self.RoleType.PROCUREMENT,
            self.RoleType.COORDINATOR,
            self.RoleType.ADMINISTRATOR
        ]
