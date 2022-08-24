import functools

from django.core.exceptions import PermissionDenied

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken


@permission_classes((IsAuthenticated,))
def benji_account_auth_setup(benji_account_id_required=True):
    def inner(func):
        @functools.wraps(func)
        def wrapper(request, *args, **kwargs):
            token = AccessToken(request.auth.token)
            benji_account_id = token.get("user_id")
            if benji_account_id_required and not benji_account_id:
                raise PermissionDenied()
            return func(request, *args, benji_account_id=benji_account_id, **kwargs)
        return wrapper
    return inner
