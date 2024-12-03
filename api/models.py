from django.db import models
from django.contrib.auth.models import User
class Movie(models.Model):
    title = models.CharField(max_length=100)
    released = models.DateField(null=True, blank=True)
    # rated = models.CharField(max_length=50)
    director = models.CharField(max_length=100, null=True, blank=True)
    # runtime_min = models.IntegerField()
    plot = models.TextField(null=True, blank=True)
    # language = models.TextField()
    # country = models.TextField()
    # awards = models.TextField()
    poster = models.URLField(max_length=500, null=True, blank=True)
    # writer = models.TextField()
    # actors = models.TextField()
    genres = models.TextField(null=True, blank=True)
    # ratings = models.JSONField(default=list)
    # metascore = models.IntegerField(null=True, blank=True)  # Metascore (e.g., 94)
    # imdb_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)  # IMDB rating (e.g., 9.0)
    # imdb_votes = models.CharField(max_length=50, null=True, blank=True)  # IMDB votes (e.g., "2,032,567")
    # imdb_id = models.CharField(max_length=50, null=True, blank=True)  # IMDB ID (e.g., "tt0167260")
    # type = models.CharField(max_length=20, null=True, blank=True)  # Type (e.g., "movie")
    # dvd = models.CharField(max_length=20, null=True, blank=True)  # DVD release (e.g., "N/A")
    # box_office = models.CharField(max_length=50, null=True, blank=True)  # Box office earnings (e.g., "$381,878,219")

    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movies')

    def __str__(self):
        return self.title
