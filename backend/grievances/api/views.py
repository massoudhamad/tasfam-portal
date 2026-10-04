"""Grievance API views - intake and status lookup."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from django.utils import timezone
import time

from grievances.models import Case, CaseEvent, CaseAttachment, CaseCategory


class GrievanceThrottle(AnonRateThrottle):
    """Rate limit grievance submissions to 5/hour per IP."""
    rate = '5/hour'


class StatusLookupThrottle(AnonRateThrottle):
    """Rate limit status lookups to 10/hour per IP."""
    rate = '10/hour'


class GrievanceSubmitView(APIView):
    """
    POST /api/v1/grievances
    Submit a new grievance. Returns only the reference number.
    """
    permission_classes = [AllowAny]
    throttle_classes = [GrievanceThrottle]

    def post(self, request):
        # Honeypot check - reject if honeypot field is filled
        if request.data.get('website'):  # Honeypot field
            return Response(
                {'error': 'Invalid submission'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Timing check - reject if submitted too fast (< 3 seconds)
        submit_time = request.data.get('_submit_time')
        if submit_time:
            try:
                elapsed = time.time() - float(submit_time)
                if elapsed < 3:
                    return Response(
                        {'error': 'Please fill out the form carefully'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (ValueError, TypeError):
                pass

        # Validate required fields
        category = request.data.get('category')
        district = request.data.get('district')
        description = request.data.get('description')

        if not all([category, district, description]):
            return Response(
                {'error': 'Missing required fields: category, district, description'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate category
        if category not in [c[0] for c in CaseCategory.choices]:
            return Response(
                {'error': 'Invalid category'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the case
        case = Case(
            category=category,
            district=district,
            description=description,
            shehia=request.data.get('shehia', ''),
            is_anonymous=request.data.get('is_anonymous', False),
            channel='web',
            preferred_language=request.data.get('preferred_language', 'sw'),
        )

        # Add complainant details if not anonymous
        if not case.is_anonymous:
            case.complainant_name = request.data.get('name', '')
            case.complainant_phone = request.data.get('phone', '')
            case.complainant_email = request.data.get('email', '')

        # Set passphrase for anonymous submissions
        passphrase = request.data.get('passphrase')
        if passphrase:
            case.set_passphrase(passphrase)

        case.save()

        # Create initial event
        CaseEvent.objects.create(
            case=case,
            event_type=CaseEvent.EventType.CREATED,
            note='Submitted via web portal',
            visible_to_complainant=True
        )

        # Handle attachments (max 5, 10MB each)
        files = request.FILES.getlist('attachments')
        if len(files) > 5:
            files = files[:5]

        for f in files:
            if f.size > 10 * 1024 * 1024:  # 10MB
                continue  # Skip oversized files

            CaseAttachment.objects.create(
                case=case,
                file=f,
                original_filename=f.name[:255],
            )

        # Return only the reference number (no sensitive data)
        return Response(
            {
                'reference': case.reference,
                'message': 'Your grievance has been received. Please save this reference number.',
                'message_sw': 'Lalamiko lako limepokelewa. Tafadhali hifadhi nambari hii ya rejea.',
            },
            status=status.HTTP_201_CREATED
        )


class GrievanceStatusView(APIView):
    """
    GET /api/v1/grievances/status
    Lookup grievance status by reference + second factor (phone or passphrase).
    Returns status and public events only - never internal notes or sensitive data.
    """
    permission_classes = [AllowAny]
    throttle_classes = [StatusLookupThrottle]

    def get(self, request):
        reference = request.query_params.get('reference', '').strip().upper()
        phone = request.query_params.get('phone', '').strip()
        passphrase = request.query_params.get('passphrase', '').strip()

        if not reference:
            return Response(
                {'error': 'Reference number required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not phone and not passphrase:
            return Response(
                {'error': 'Phone number or passphrase required for verification'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find the case
        try:
            case = Case.objects.get(reference=reference)
        except Case.DoesNotExist:
            # Generic error to prevent enumeration
            return Response(
                {'error': 'Invalid reference or verification failed'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Verify second factor
        verified = False
        if phone and case.complainant_phone:
            # Normalize phone comparison
            verified = phone.replace(' ', '').replace('-', '') in case.complainant_phone.replace(' ', '').replace('-', '')
        elif passphrase:
            verified = case.verify_passphrase(passphrase)

        if not verified:
            return Response(
                {'error': 'Invalid reference or verification failed'},
                status=status.HTTP_404_NOT_FOUND
            )

        # For sensitive cases, return minimal information
        if case.is_sensitive:
            return Response({
                'reference': case.reference,
                'status': case.status,
                'status_display': case.get_status_display(),
                'created_at': case.created_at.isoformat(),
                'is_sensitive': True,
                'message': 'For privacy protection, detailed status for sensitive cases is available only through direct contact with the GBV focal point.',
                'message_sw': 'Kwa ulinzi wa faragha, hali ya kina kwa kesi nyeti inapatikana tu kwa kuwasiliana moja kwa moja na mshauri wa GBV.',
            })

        # Get public events
        events = case.events.filter(visible_to_complainant=True).order_by('timestamp')
        event_data = []
        for event in events:
            event_data.append({
                'type': event.event_type,
                'type_display': event.get_event_type_display(),
                'timestamp': event.timestamp.isoformat(),
                'note': event.note if not case.is_sensitive else '',
            })

        return Response({
            'reference': case.reference,
            'category': case.get_category_display(),
            'status': case.status,
            'status_display': case.get_status_display(),
            'created_at': case.created_at.isoformat(),
            'acknowledged_at': case.acknowledged_at.isoformat() if case.acknowledged_at else None,
            'resolved_at': case.resolved_at.isoformat() if case.resolved_at else None,
            'events': event_data,
            'resolution': case.resolution_summary if case.status in ['resolved', 'closed'] else None,
        })
