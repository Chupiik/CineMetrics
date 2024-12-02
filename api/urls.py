from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.MovieListCreate.as_view(), name='movie-list'),
    path('movies/delete/<int:pk>/', views.MovieDelete.as_view(), name='delete-movie'),
]