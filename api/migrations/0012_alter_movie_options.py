# Generated by Django 5.1.3 on 2025-02-06 03:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_movie_actors_movie_country_movie_imdb_rating_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='movie',
            options={'ordering': ['id']},
        ),
    ]
