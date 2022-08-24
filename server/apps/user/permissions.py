from rest_framework.permissions import BasePermission


class AccountManagerPermission(BasePermission):

    edit_methods = ("PUT", "PATCH")

    def has_permission(self, request, view):
        """Allow account managers to see restricted data"""
        authorized_user_emails = [
            "kant.chen.yan.cheng@gmail.com",
            "mark.bobkov+prod@alenasolutions.com",
        ]
        if request.user.email in authorized_user_emails:
            return True

        return False
