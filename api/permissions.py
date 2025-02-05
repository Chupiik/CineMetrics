from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name="Admin").exists()