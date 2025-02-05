from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Movie, Genre, MovieList, Comment, Review
import re



class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["name"]


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True, queryset=Group.objects.all(), slug_field="name", required=False, allow_empty=True
    )

    class Meta:
        model = User
        fields = ["id", "username", "password", "groups"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_username(self, value):
        """Ensure the username is unique"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_password(self, value):
        """Ensure password is strong enough"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value

    def create(self, validated_data):
        groups_data = validated_data.pop("groups", [])
        user = User.objects.create_user(**validated_data)

        for group_name in groups_data:
            group, _ = Group.objects.get_or_create(name=group_name)
            user.groups.add(group)

        return user


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]

    def to_internal_value(self, data):
        if isinstance(data, dict):
            name = data.get("name", "").strip()
        elif isinstance(data, str):
            name = data.strip()
        else:
            raise serializers.ValidationError("Invalid genre format.")

        try:
            return Genre.objects.get(name=name)
        except Genre.DoesNotExist:
            return Genre(name=name)


class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True)

    class Meta:
        model = Movie
        fields = ["id", "title", "plot", "released", "director", "poster", "genres"]

    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("Title is required.")
        return value

    def create(self, validated_data):
        genres_data = validated_data.pop("genres", [])
        movie = Movie.objects.create(**validated_data)

        for genre in genres_data:
            genre, _ = Genre.objects.get_or_create(name=genre.name)
            movie.genres.add(genre)

        return movie

    def update(self, instance, validated_data):
        genres_data = validated_data.pop("genres", None)
        if genres_data is not None:
            instance.genres.clear()

            for genre in genres_data:
                genre, _ = Genre.objects.get_or_create(name=genre.name)
                instance.genres.add(genre)

        return super().update(instance, validated_data)


class MovieListSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = MovieList
        fields = ['id', 'name', 'description', 'is_public', 'created_at', 'created_by', 'movies', 'users']
        extra_kwargs = {
            'users': {'required': False}
        }


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'movie', 'review', 'parent', 'content', 'created_at', 'replies']
        read_only_fields = ["id", "user", "created_at", "replies"]

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Review
        fields = ['id', 'user', 'movie', 'rating', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']