from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from rest_framework.exceptions import ValidationError


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
    poster_uploaded = models.ImageField(upload_to='movie_posters/', null=True, blank=True)
    writer = models.TextField(null=True, blank=True)
    actors = models.TextField(null=True, blank=True)
    genres = models.ManyToManyField(Genre, related_name='movies')
    imdb_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title

    def clean(self):
        if not self.title or not self.title.strip():
            raise ValidationError({'title': 'Title is required and cannot be blank.'})

        if self.runtime_min is not None and self.runtime_min <= 0:
            raise ValidationError({'runtime_min': 'Runtime must be a positive number.'})

        if self.imdb_rating is not None and (self.imdb_rating < 0 or self.imdb_rating > 10):
            raise ValidationError({'imdb_rating': 'IMDB rating must be between 0 and 10.'})

        def save(self, *args, **kwargs):
            self.full_clean()
            super().save(*args, **kwargs)


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

    def clean(self):
        if not self.content or not self.content.strip():
            raise ValidationError({'content': 'Content cannot be empty.'})
        if self.parent is None and not (self.movie or self.review):
            raise ValidationError("A comment must be linked with either a movie or a review.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


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

    def clean(self):
        if not self.name or not self.name.strip():
            raise ValidationError({'name': 'List name is required.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


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