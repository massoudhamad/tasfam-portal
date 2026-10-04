"""Indicators admin."""
from django.contrib import admin
from django.utils import timezone
from .models import Indicator, IndicatorValue


class IndicatorValueInline(admin.TabularInline):
    model = IndicatorValue
    extra = 1
    fields = ['fiscal_year', 'period', 'disaggregation', 'value', 'is_verified', 'verified_by']
    readonly_fields = ['verified_by']


@admin.register(Indicator)
class IndicatorAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'level', 'lens', 'baseline', 'target', 'is_public']
    list_filter = ['level', 'lens', 'component', 'is_public']
    search_fields = ['code', 'name', 'name_sw']
    inlines = [IndicatorValueInline]

    fieldsets = (
        ('Indicator (English)', {
            'fields': ('code', 'name', 'definition')
        }),
        ('Indicator (Kiswahili)', {
            'fields': ('name_sw', 'definition_sw'),
            'classes': ('collapse',)
        }),
        ('Classification', {
            'fields': ('level', 'lens', 'component', 'unit')
        }),
        ('Targets', {
            'fields': ('baseline', 'target')
        }),
        ('Display', {
            'fields': ('is_public', 'display_format', 'display_order')
        }),
    )


@admin.register(IndicatorValue)
class IndicatorValueAdmin(admin.ModelAdmin):
    list_display = ['indicator', 'fiscal_year', 'period', 'disaggregation', 'value', 'is_verified', 'verified_at']
    list_filter = ['is_verified', 'fiscal_year', 'period', 'disaggregation', 'indicator__lens']
    search_fields = ['indicator__code', 'indicator__name']
    raw_id_fields = ['indicator', 'created_by', 'verified_by']
    readonly_fields = ['verified_at']

    actions = ['verify_values']

    def verify_values(self, request, queryset):
        count = 0
        for value in queryset.filter(is_verified=False):
            value.is_verified = True
            value.verified_by = request.user
            value.verified_at = timezone.now()
            value.save()
            count += 1
        self.message_user(request, f'{count} values verified.')
    verify_values.short_description = 'Mark selected values as verified'
