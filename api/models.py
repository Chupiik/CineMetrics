from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=100)
    released = models.DateField(null=True, blank=True)
    director = models.CharField(max_length=100, null=True, blank=True)
    runtime_min = models.IntegerField(null=True, blank=True)
    plot = models.TextField(null=True, blank=True)
    country = models.TextField(null=True, blank=True)
    poster = models.URLField(max_length=500, null=True, blank=True)
    writer = models.TextField(null=True, blank=True)
    actors = models.TextField(null=True, blank=True)
    genres = models.ManyToManyField(Genre, related_name='movies')
    imdb_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)


    def __str__(self):
        return self.title


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True, blank=True)
    review = models.ForeignKey('Review', on_delete=models.CASCADE, related_name='comments',
                               null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.parent:
            return f'Reply by {self.user.username} on comment {self.parent.id}'
        return f'Comment by {self.user.username} on {self.movie.title if self.movie else "discussion"}'



class MovieList(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    users = models.ManyToManyField(User, related_name='movie_lists')
    movies = models.ManyToManyField(Movie, related_name='movie_lists')
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_movie_lists')

    def __str__(self):
        return self.name


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.movie.title}"
