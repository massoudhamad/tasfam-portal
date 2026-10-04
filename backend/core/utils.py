"""Core utilities for TASFAM portal."""
import os
import hashlib
from django.conf import settings
from django.http import JsonResponse
from django.core.exceptions import ValidationError

try:
    import magic
    HAS_MAGIC = True
except ImportError:
    HAS_MAGIC = False


def validate_file_extension(file):
    """Validate file extension against allowed list."""
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in settings.ALLOWED_UPLOAD_EXTENSIONS:
        raise ValidationError(
            f'File type "{ext}" is not allowed. Allowed types: {", ".join(settings.ALLOWED_UPLOAD_EXTENSIONS)}'
        )


def validate_file_size(file, max_size=None):
    """Validate file size."""
    max_size = max_size or settings.MAX_UPLOAD_SIZE
    if file.size > max_size:
        raise ValidationError(
            f'File size ({file.size // (1024*1024)}MB) exceeds maximum allowed ({max_size // (1024*1024)}MB).'
        )


def validate_file_type(file):
    """Validate file type using magic bytes."""
    if not HAS_MAGIC:
        # Fall back to extension-based validation if libmagic is not available
        return

    mime = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0)

    allowed_mimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm',
    ]

    if mime not in allowed_mimes:
        raise ValidationError(f'File type "{mime}" is not allowed.')


def generate_file_hash(file):
    """Generate SHA-256 hash of file content."""
    hasher = hashlib.sha256()
    for chunk in file.chunks():
        hasher.update(chunk)
    file.seek(0)
    return hasher.hexdigest()


def lockout_response(request, credentials, *args, **kwargs):
    """Custom lockout response for django-axes."""
    return JsonResponse(
        {
            'error': 'Too many failed login attempts. Please try again in 15 minutes.',
            'error_sw': 'Majaribio mengi ya kuingia yameshindikana. Tafadhali jaribu tena baada ya dakika 15.'
        },
        status=429
    )


def upload_to_path(instance, filename, folder='uploads'):
    """Generate upload path for files."""
    ext = os.path.splitext(filename)[1].lower()
    # Use UUID to prevent filename collisions
    new_filename = f"{instance.id}{ext}"
    return os.path.join(folder, new_filename)


def media_upload_path(instance, filename):
    """Upload path for media assets (videos, images, logos)."""
    return upload_to_path(instance, filename, 'media')


def document_upload_path(instance, filename):
    """Upload path for documents (publications, tenders)."""
    return upload_to_path(instance, filename, 'documents')


def tender_upload_path(instance, filename):
    """Upload path for tender documents."""
    return upload_to_path(instance, filename, 'tenders')


def grievance_attachment_path(instance, filename):
    """Upload path for grievance attachments - stored separately and encrypted."""
    return upload_to_path(instance, filename, 'grievances/attachments')
