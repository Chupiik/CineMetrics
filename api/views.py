from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, MovieSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Movie
# Create your views here.

class MovieListCreate(generics.ListCreateAPIView):
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movie.objects.filter(uploaded_by=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(uploaded_by=self.request.user)
        else:
            print(serializer.errors)

class MovieDelete(generics.DestroyAPIView):
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movie.objects.filter(uploaded_by=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


