from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.core.paginator import EmptyPage
from rest_framework.utils.urls import replace_query_param

class MoviePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        page_size = self.get_page_size(request)
        if not page_size:
            return None

        paginator = self.django_paginator_class(queryset, page_size)
        page_number = request.query_params.get(self.page_query_param, 1)
        try:
            self.page = paginator.page(page_number)
        except EmptyPage:
            self.page = None
            self.paginator = paginator
            return []

        self.paginator = paginator
        self.request = request
        return list(self.page)

    def get_next_link(self):
        if self.page is None or not self.page.has_next():
            return None
        page_number = self.page.next_page_number()
        url = self.request.build_absolute_uri(self.request.get_full_path())
        return replace_query_param(url, self.page_query_param, page_number)

    def get_previous_link(self):
        if self.page is None or not self.page.has_previous():
            return None
        page_number = self.page.previous_page_number()
        url = self.request.build_absolute_uri(self.request.get_full_path())
        return replace_query_param(url, self.page_query_param, page_number)

    def get_paginated_response(self, data):
        return Response({
            'count': self.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'movies': data,
        })
