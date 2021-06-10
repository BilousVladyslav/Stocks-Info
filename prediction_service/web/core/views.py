from django.conf import settings
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.http import Http404
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet


class SignatureViewSet(GenericViewSet):
    permission_classes = [AllowAny]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )

        signer = TimestampSigner()
        try:
            pk_value = signer.unsign(self.kwargs[lookup_url_kwarg], max_age=settings.USER_CONFIRMATION_TIMEOUT)
        except (BadSignature, SignatureExpired):
            raise Http404

        filter_kwargs = {self.lookup_field: pk_value}
        obj = get_object_or_404(queryset, **filter_kwargs)

        return obj
