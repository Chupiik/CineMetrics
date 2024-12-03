from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.MovieListCreate.as_view(), name='movie-list'),
    path('movies/delete/<int:pk>/', views.MovieDelete.as_view(), name='delete-movie'),
    path('movies/edit/<int:pk>/', views.MovieUpdate.as_view(), name='update-movie'),
    path('movies/<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),
]