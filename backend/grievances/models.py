"""
Grievance Redress Mechanism (GRM) models.
This is the most sensitive part of the system - handle with care.
"""
import uuid
import secrets
from datetime import timedelta
from django.db import models
from django.utils import timezone
from django.conf import settings
from core.utils import grievance_attachment_path


class CaseCategory(models.TextChoices):
    PROJECT = 'project', 'Project Implementation'
    ENVIRONMENTAL = 'environmental', 'Environmental Concern'
    SOCIAL = 'social', 'Social Impact'
    LABOR = 'labor', 'Labor Issues'
    CORRUPTION = 'corruption', 'Corruption/Fraud'
    GBV = 'gbv', 'Gender-Based Violence / Harassment'
    OTHER = 'other', 'Other'


class CaseStatus(models.TextChoices):
    RECEIVED = 'received', 'Received'
    ACKNOWLEDGED = 'acknowledged', 'Acknowledged'
    UNDER_REVIEW = 'under_review', 'Under Review'
    ACTION_AGREED = 'action_agreed', 'Action Agreed'
    RESOLVED = 'resolved', 'Resolved'
    CLOSED = 'closed', 'Closed'
    REFERRED = 'referred', 'Referred'
    APPEALED = 'appealed', 'Appealed'
    REOPENED = 'reopened', 'Reopened'


class CaseChannel(models.TextChoices):
    WEB = 'web', 'Web Portal'
    PHONE = 'phone', 'Phone'
    IN_PERSON = 'in_person', 'In Person'
    LETTER = 'letter', 'Letter'
    SHEHIA = 'shehia', 'Shehia Committee'


def generate_reference():
    """Generate grievance reference number: TASFAM-GRM-YYYY-NNNN"""
    year = timezone.now().year
    # Get the next sequence number for this year
    last_case = Case.objects.filter(
        reference__startswith=f'TASFAM-GRM-{year}-'
    ).order_by('-reference').first()

    if last_case:
        last_num = int(last_case.reference.split('-')[-1])
        next_num = last_num + 1
    else:
        next_num = 1

    return f'TASFAM-GRM-{year}-{next_num:04d}'


class Case(models.Model):
    """
    Grievance case - the core model for the GRM.
    Personal fields are encrypted at rest in production.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=25, unique=True, default=generate_reference, db_index=True)

    # Category and sensitivity
    category = models.CharField(max_length=20, choices=CaseCategory.choices, db_index=True)
    sub_category = models.CharField(max_length=100, blank=True)
    is_sensitive = models.BooleanField(
        default=False,
        db_index=True,
        help_text='Auto-set for GBV/SEA/SH cases. Visible only to GBV focal point and coordinator.'
    )

    # Channel and anonymity
    channel = models.CharField(max_length=20, choices=CaseChannel.choices, default=CaseChannel.WEB)
    is_anonymous = models.BooleanField(default=False)

    # Complainant details (encrypted at rest in production)
    complainant_name = models.CharField(max_length=255, blank=True)
    complainant_phone = models.CharField(max_length=50, blank=True)
    complainant_email = models.EmailField(blank=True)
    preferred_language = models.CharField(
        max_length=2,
        choices=[('en', 'English'), ('sw', 'Kiswahili')],
        default='sw'
    )
    passphrase_hash = models.CharField(
        max_length=128,
        blank=True,
        help_text='Hashed passphrase for anonymous case lookup'
    )

    # Location
    district = models.CharField(max_length=100, db_index=True)
    shehia = models.CharField(max_length=100, blank=True)
    sub_project = models.ForeignKey(
        'content.SubProject',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='grievances'
    )

    # Description (encrypted at rest in production for sensitive cases)
    description = models.TextField()
    occurred_on = models.DateField(null=True, blank=True)

    # Status and workflow
    status = models.CharField(
        max_length=20,
        choices=CaseStatus.choices,
        default=CaseStatus.RECEIVED,
        db_index=True
    )
    severity = models.CharField(
        max_length=20,
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')],
        default='medium'
    )

    # Assignment and SLA
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_cases'
    )
    due_at = models.DateTimeField(null=True, blank=True, db_index=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    # Resolution
    resolution_summary = models.TextField(blank=True)
    satisfaction = models.CharField(
        max_length=20,
        choices=[
            ('satisfied', 'Satisfied'),
            ('partially', 'Partially Satisfied'),
            ('unsatisfied', 'Unsatisfied'),
            ('no_response', 'No Response')
        ],
        blank=True
    )
    appeal_flag = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'is_sensitive']),
            models.Index(fields=['district', 'status']),
            models.Index(fields=['due_at', 'status']),
        ]

    def __str__(self):
        return self.reference

    def save(self, *args, **kwargs):
        # Auto-flag sensitive cases
        if self.category == CaseCategory.GBV:
            self.is_sensitive = True

        # Set due date (30 days from creation)
        if not self.due_at and not self.pk:
            self.due_at = timezone.now() + timedelta(days=30)

        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        if self.status in [CaseStatus.RESOLVED, CaseStatus.CLOSED]:
            return False
        return self.due_at and timezone.now() > self.due_at

    @property
    def sla_warning(self):
        """Return True if case is at 80% of SLA window."""
        if not self.due_at or self.status in [CaseStatus.RESOLVED, CaseStatus.CLOSED]:
            return False
        warning_threshold = self.created_at + timedelta(days=24)  # 80% of 30 days
        return timezone.now() > warning_threshold and not self.is_overdue

    def acknowledge(self, user):
        """Mark case as acknowledged."""
        self.status = CaseStatus.ACKNOWLEDGED
        self.acknowledged_at = timezone.now()
        self.save()
        CaseEvent.objects.create(
            case=self,
            actor=user,
            event_type=CaseEvent.EventType.ACKNOWLEDGED,
            visible_to_complainant=True
        )

    def set_passphrase(self, passphrase):
        """Hash and store passphrase for anonymous case lookup."""
        import hashlib
        salt = secrets.token_hex(16)
        hash_obj = hashlib.pbkdf2_hmac('sha256', passphrase.encode(), salt.encode(), 100000)
        self.passphrase_hash = f"{salt}${hash_obj.hex()}"

    def verify_passphrase(self, passphrase):
        """Verify passphrase for case lookup."""
        import hashlib
        if not self.passphrase_hash:
            return False
        try:
            salt, hash_hex = self.passphrase_hash.split('$')
            hash_obj = hashlib.pbkdf2_hmac('sha256', passphrase.encode(), salt.encode(), 100000)
            return hash_obj.hex() == hash_hex
        except (ValueError, AttributeError):
            return False


class CaseEvent(models.Model):
    """
    Case event log - append-only timeline of all case actions.
    No edits, no deletes - this is an audit trail.
    """
    class EventType(models.TextChoices):
        CREATED = 'created', 'Case Created'
        ACKNOWLEDGED = 'acknowledged', 'Acknowledged'
        ASSIGNED = 'assigned', 'Assigned'
        INVESTIGATED = 'investigated', 'Under Investigation'
        REFERRED = 'referred', 'Referred to External Party'
        RESPONDED = 'responded', 'Response Provided'
        APPEALED = 'appealed', 'Appeal Filed'
        CLOSED = 'closed', 'Closed'
        REOPENED = 'reopened', 'Reopened'
        NOTE = 'note', 'Internal Note'
        STATUS_CHANGE = 'status_change', 'Status Changed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='events')
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='case_events'
    )
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    note = models.TextField(blank=True)
    visible_to_complainant = models.BooleanField(
        default=False,
        help_text='If True, complainant can see this event in status lookup'
    )
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.case.reference} - {self.get_event_type_display()}"

    def save(self, *args, **kwargs):
        # Prevent modification of existing events
        if self.pk:
            raise ValueError("Case events cannot be modified.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("Case events cannot be deleted.")


class CaseAttachment(models.Model):
    """
    Grievance attachments - stored separately and encrypted at rest.
    Virus-scanned before storage.
    """
    class ScanStatus(models.TextChoices):
        PENDING = 'pending', 'Pending Scan'
        CLEAN = 'clean', 'Clean'
        INFECTED = 'infected', 'Infected'
        ERROR = 'error', 'Scan Error'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to=grievance_attachment_path)
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True)

    scan_status = models.CharField(
        max_length=20,
        choices=ScanStatus.choices,
        default=ScanStatus.PENDING
    )
    scan_result = models.TextField(blank=True)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return f"{self.case.reference} - {self.original_filename}"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)
