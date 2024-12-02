from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "description", "uploaded_at", "uploaded_by"]
        extra_kwargs = {"uploaded_by": {"read_only": True}}
