from django.urls import path
from . import views
from .views import UserProfileView, MovieListDetail, MovieListUpdate, SaveMovieList, UnsaveMovieList, \
    AddComment, EditComment, DeleteComment, GetMovieComments, CommentRepliesView, MovieReviewList, MovieReviewCreate, \
    ReviewRetrieve, ReviewUpdate, ReviewDelete, GetReviewComments, OMDBMassUploadView

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('movies/add/', views.MovieCreate.as_view(), name='movie-add'),
    path('movies/', views.MoviesGet.as_view(), name='movie-list'),
    path('movies/delete/<int:pk>/', views.MovieDelete.as_view(), name='delete-movie'),
    path('movies/edit/<int:pk>/', views.MovieUpdate.as_view(), name='update-movie'),
    path('movies/<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),
    path('user-profile/', UserProfileView.as_view(), name="user-profile"),
    path('movie-lists/', views.UserMovieList.as_view(), name='user-movie-lists'),
    path('movie-lists-created/', views.UserCreatedMovieList.as_view(), name='user-created-movie-lists'),
    path('movie-lists/<int:list_id>/add/', views.AddMovieToList.as_view(), name='add-movie-to-list'),
    path('movie-lists/<int:list_id>/remove/', views.RemoveMovieFromList.as_view(), name='remove-movie-from-list'),
    path('movie-lists/add/', views.MovieListCreate.as_view(), name='add-movie-list'),
    path('movie-lists/edit/<int:list_id>/', MovieListUpdate.as_view(), name='edit-movie-list'),
    path('movie-lists/<int:list_id>/', MovieListDetail.as_view(), name='get-movie-list'),
    path('movie-lists/<int:list_id>/save/', SaveMovieList.as_view(), name='save-movie-list'),
    path('movie-lists/<int:list_id>/unsave/', UnsaveMovieList.as_view(), name='unsave-movie-list'),
    path("comments/add/", AddComment.as_view(), name="add-comment"),
    path("comments/<int:comment_id>/edit/", EditComment.as_view(), name="edit-comment"),
    path("comments/<int:comment_id>/delete/", DeleteComment.as_view(), name="delete-comment"),
    path("movies/<int:movie_id>/comments/", GetMovieComments.as_view(), name="get-movie-comments"),
    path('comments/<int:comment_id>/replies/', CommentRepliesView.as_view(), name='comment-replies'),
    path("movies/<int:movie_id>/reviews/", MovieReviewList.as_view(), name="movie-review-list"),
    path("movies/<int:movie_id>/reviews/create/", MovieReviewCreate.as_view(), name="movie-review-create"),
    path("reviews/<int:review_id>/", ReviewRetrieve.as_view(), name="review-retrieve"),
    path("reviews/<int:review_id>/edit/", ReviewUpdate.as_view(), name="review-update"),
    path("reviews/<int:review_id>/delete/", ReviewDelete.as_view(), name="review-delete"),
    path("reviews/<int:review_id>/comments/", GetReviewComments.as_view(), name="review-comment-list"),
    path('genres/', views.GenreList.as_view(), name='genre-list'),
    path('omdb-mass-upload/', OMDBMassUploadView.as_view(), name='omdb_mass_upload'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)