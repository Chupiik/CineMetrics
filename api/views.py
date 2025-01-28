from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from rest_framework.response import Response

from .serializers import UserSerializer, MovieSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Movie
class MovieListCreate(generics.ListCreateAPIView):
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        #user = self.request.user
        #return Movie.objects.filter(uploaded_by=user)
        return Movie.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(uploaded_by=self.request.user)
        else:
            raise serializers.ValidationError(serializer.errors)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieDelete(generics.DestroyAPIView):
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movie.objects.filter(uploaded_by=user)

    def delete(self, request, *args, **kwargs):
        try:
            movie = self.get_object()
            if movie.uploaded_by == request.user:
                movie.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"detail": "You do not have permission to delete this movie."}, status=status.HTTP_403_FORBIDDEN)
        except Movie.DoesNotExist:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

class MovieUpdate(generics.UpdateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movie.objects.filter(uploaded_by=user)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save(uploaded_by=self.request.user)
        else:
            raise serializers.ValidationError(serializer.errors)

    def put(self, request, *args, **kwargs):
        movie = self.get_object()
        if movie.uploaded_by != request.user:
            return Response({"detail": "You do not have permission to update this movie."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieDetail(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movie.objects.filter(uploaded_by=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)