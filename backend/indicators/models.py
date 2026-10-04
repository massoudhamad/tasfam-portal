"""Indicators and M&E models."""
import uuid
from django.db import models
from django.conf import settings


class Indicator(models.Model):
    """Project indicators (PDO and intermediate)."""
    class Level(models.TextChoices):
        PDO = 'pdo', 'PDO Indicator'
        INTERMEDIATE = 'intermediate', 'Intermediate Result'

    class Lens(models.TextChoices):
        PEOPLE = 'people', 'People Reached'
        OCEAN = 'ocean', 'Ocean & Stocks'
        INSTITUTIONS = 'institutions', 'Institutions'
        LIVELIHOODS = 'livelihoods', 'Jobs & Livelihoods'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True, db_index=True)
    level = models.CharField(max_length=20, choices=Level.choices)

    name = models.CharField(max_length=255)
    name_sw = models.CharField(max_length=255, blank=True)
    definition = models.TextField()
    definition_sw = models.TextField(blank=True)

    unit = models.CharField(max_length=50)
    lens = models.CharField(max_length=20, choices=Lens.choices, db_index=True)

    baseline = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    target = models.DecimalField(max_digits=15, decimal_places=2)

    component = models.ForeignKey(
        'content.ProjectComponent',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='indicators'
    )

    is_public = models.BooleanField(default=True, help_text='Show on public dashboard')
    display_format = models.CharField(
        max_length=20,
        choices=[('number', 'Number'), ('percent', 'Percentage'), ('currency', 'Currency')],
        default='number'
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'code']

    def __str__(self):
        return f"{self.code}: {self.name}"


class IndicatorValue(models.Model):
    """Indicator values with verification."""
    class Period(models.TextChoices):
        Q1 = 'q1', 'Q1'
        Q2 = 'q2', 'Q2'
        Q3 = 'q3', 'Q3'
        Q4 = 'q4', 'Q4'
        ANNUAL = 'annual', 'Annual'

    class Disaggregation(models.TextChoices):
        TOTAL = 'total', 'Total'
        FEMALE = 'female', 'Female'
        MALE = 'male', 'Male'
        YOUTH = 'youth', 'Youth (18-35)'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE, related_name='values')

    fiscal_year = models.PositiveIntegerField(db_index=True)
    period = models.CharField(max_length=10, choices=Period.choices)
    disaggregation = models.CharField(
        max_length=20,
        choices=Disaggregation.choices,
        default=Disaggregation.TOTAL
    )

    value = models.DecimalField(max_digits=15, decimal_places=2)

    evidence_file = models.FileField(upload_to='indicators/evidence/', blank=True)
    evidence_description = models.TextField(blank=True)

    is_verified = models.BooleanField(default=False, db_index=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_values'
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    note = models.TextField(blank=True)
    note_sw = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='indicator_values'
    )

    class Meta:
        ordering = ['-fiscal_year', 'period']
        unique_together = ['indicator', 'fiscal_year', 'period', 'disaggregation']

    def __str__(self):
        return f"{self.indicator.code} FY{self.fiscal_year} {self.period}: {self.value}"
