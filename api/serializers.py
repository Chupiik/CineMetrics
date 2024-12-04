from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie
import re


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "password"]
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
        user = User.objects.create_user(**validated_data)
        return user

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "plot", "released", "director", "poster", "genres", "uploaded_at", "uploaded_by"]
        extra_kwargs = {"uploaded_by": {"read_only": True}}

    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("Title is required.")
        return value