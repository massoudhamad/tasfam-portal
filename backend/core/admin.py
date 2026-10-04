"""Core admin configuration."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import AuditLog, StaffRole


class StaffRoleInline(admin.StackedInline):
    model = StaffRole
    can_delete = False
    verbose_name_plural = 'Staff Role'


class UserAdmin(BaseUserAdmin):
    inlines = [StaffRoleInline]
    list_display = ['username', 'email', 'first_name', 'last_name', 'get_role', 'is_active', 'is_staff']

    def get_role(self, obj):
        try:
            return obj.staff_role.get_role_display()
        except StaffRole.DoesNotExist:
            return '-'
    get_role.short_description = 'Role'


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'actor', 'action', 'model_name', 'object_id', 'is_sensitive']
    list_filter = ['action', 'model_name', 'is_sensitive', 'timestamp']
    search_fields = ['actor__username', 'object_id']
    readonly_fields = ['id', 'timestamp', 'actor', 'action', 'model_name', 'object_id', 'changes', 'ip_address', 'user_agent', 'is_sensitive']
    date_hierarchy = 'timestamp'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(StaffRole)
class StaffRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    raw_id_fields = ['user']


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
