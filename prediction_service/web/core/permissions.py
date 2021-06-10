from rest_framework.permissions import BasePermission


class IsNotAuthenticated(BasePermission):

    def has_permission(self, request, view):
        return request.user is None or not request.user.is_authenticated
