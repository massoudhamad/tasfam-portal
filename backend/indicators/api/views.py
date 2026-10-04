"""Indicators API views."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from indicators.models import Indicator


class IndicatorListView(APIView):
    """List public indicators with verified values."""
    permission_classes = [AllowAny]

    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        lens = request.query_params.get('lens')

        indicators = Indicator.objects.filter(is_public=True)
        if lens:
            indicators = indicators.filter(lens=lens)

        data = []
        for ind in indicators:
            # Get latest verified value
            latest = ind.values.filter(is_verified=True).order_by('-fiscal_year', '-period').first()

            values = []
            for val in ind.values.filter(is_verified=True).order_by('fiscal_year', 'period'):
                values.append({
                    'fiscal_year': val.fiscal_year,
                    'period': val.period,
                    'value': str(val.value),
                    'disaggregation': val.disaggregation,
                })

            data.append({
                'id': str(ind.id),
                'code': ind.code,
                'name': ind.name_sw if lang == 'sw' and ind.name_sw else ind.name,
                'definition': ind.definition_sw if lang == 'sw' and ind.definition_sw else ind.definition,
                'unit': ind.unit,
                'lens': ind.lens,
                'level': ind.level,
                'baseline': str(ind.baseline),
                'target': str(ind.target),
                'current_value': str(latest.value) if latest else None,
                'display_format': ind.display_format,
                'values': values,
            })

        return Response(data)
