# Generated by Django 5.1.3 on 2024-12-02 23:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_movie_released_date'),
    ]

    operations = [
        migrations.RenameField(
            model_name='movie',
            old_name='name',
            new_name='title',
        ),
    ]
