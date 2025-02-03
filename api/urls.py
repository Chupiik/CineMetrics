from django.urls import path
from . import views
from .views import UserProfileView, MovieListDetail

urlpatterns = [
    path('movies/add/', views.MovieCreate.as_view(), name='movie-add'),
    path('movies/', views.MoviesGet.as_view(), name='movie-list'),
    path('movies/delete/<int:pk>/', views.MovieDelete.as_view(), name='delete-movie'),
    path('movies/edit/<int:pk>/', views.MovieUpdate.as_view(), name='update-movie'),
    path('movies/<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),
    path('user-profile/', UserProfileView.as_view(), name="user-profile"),
    path('movie-lists/', views.UserMovieList.as_view(), name='user-movie-lists'),
    path('movie-lists/<int:list_id>/add/', views.AddMovieToList.as_view(), name='add-movie-to-list'),
    path('movie-lists/add/', views.MovieListCreate.as_view(), name='add-movie-list'),
    path('movie-lists/<int:list_id>/', MovieListDetail.as_view(), name='get-movie-list'),
]
