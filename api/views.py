from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, MovieSerializer, MovieListSerializer, CommentSerializer
from .models import Movie, MovieList, Comment
from .permissions import IsAdminUser
from django.shortcuts import get_object_or_404


class MoviesGet(generics.ListAPIView):
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Movie.objects.filter()


class MovieCreate(generics.ListCreateAPIView):
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return Movie.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
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
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return Movie.objects.filter()

    def delete(self, request, *args, **kwargs):
        try:
            movie = self.get_object()
            if request.user.groups.filter(name="Admin").exists():
                movie.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"detail": "You do not have permission to delete this movie."},
                            status=status.HTTP_403_FORBIDDEN)
        except Movie.DoesNotExist:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)


class MovieUpdate(generics.UpdateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return Movie.objects.filter()

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            raise serializers.ValidationError(serializer.errors)

    def put(self, request, *args, **kwargs):
        movie = self.get_object()
        if not request.user.groups.filter(name="Admin").exists():
            return Response({"detail": "You do not have permission to update this movie."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovieDetail(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = []

    def get_queryset(self):
        return Movie.objects.filter()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        if user:
            default_lists = [
                {"name": "📌 Plan to Watch", "description": "A lineup of potential next favorites!", "is_public": False},
                {"name": "✅ Watched", "description": "A list of movies I’ve checked off my watchlist!", "is_public": False},
                {"name": "❤️ Favorite", "description": "My personal hall of fame for movies!", "is_public": False},
            ]

            for movie_list in default_lists:
                created_list = MovieList.objects.create(
                    name=movie_list["name"],
                    description=movie_list["description"],
                    is_public=movie_list["is_public"],
                    created_by=user,
                )
                created_list.users.add(user)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "groups": list(user.groups.values_list("name", flat=True)),
        })


class UserMovieList(generics.ListAPIView):
    serializer_class = MovieListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MovieList.objects.filter(users=self.request.user)


class AddMovieToList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        movie_id = request.data.get("movie")
        if not movie_id:
            return Response({"detail": "Movie id is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            movie_list = MovieList.objects.get(id=list_id)
        except MovieList.DoesNotExist:
            return Response({"detail": "Movie list not found."}, status=status.HTTP_404_NOT_FOUND)

        if not movie_list.created_by == request.user:
            return Response({"detail": "You do not have permission to modify this list."},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        movie_list.movies.add(movie)
        return Response({"detail": "Movie added to list."}, status=status.HTTP_200_OK)


class MovieListCreate(generics.CreateAPIView):
    serializer_class = MovieListSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        movie_list = serializer.save(created_by=self.request.user)
        movie_list.users.add(self.request.user)


class MovieListDetail(generics.RetrieveAPIView):
    serializer_class = MovieListSerializer
    permission_classes = []

    def get(self, request, *args, **kwargs):
        list_id = kwargs.get("list_id")
        movie_list = get_object_or_404(MovieList, id=list_id)
        serializer = self.get_serializer(movie_list)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCreatedMovieList(generics.ListAPIView):
    serializer_class = MovieListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MovieList.objects.filter(created_by=self.request.user)


class RemoveMovieFromList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        movie_id = request.data.get("movie")
        if not movie_id:
            return Response({"detail": "Movie id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie_list = MovieList.objects.get(id=list_id)
        except MovieList.DoesNotExist:
            return Response({"detail": "Movie list not found."}, status=status.HTTP_404_NOT_FOUND)

        if not movie_list.created_by == request.user:
            return Response({"detail": "You do not have permission to modify this list."},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        if movie in movie_list.movies.all():
            movie_list.movies.remove(movie)
            return Response({"detail": "Movie removed from list."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Movie not in this list."}, status=status.HTTP_400_BAD_REQUEST)


class MovieListUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, list_id):
        movie_list = get_object_or_404(MovieList, id=list_id)

        if movie_list.created_by != request.user:
            return Response(
                {"detail": "You do not have permission to edit this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = MovieListSerializer(movie_list, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SaveMovieList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        movie_list = get_object_or_404(MovieList, id=list_id)
        movie_list.users.add(request.user)
        return Response({"detail": "Movie list saved."}, status=status.HTTP_200_OK)


class UnsaveMovieList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        movie_list = get_object_or_404(MovieList, id=list_id)
        movie_list.users.remove(request.user)
        return Response({"detail": "Movie list removed from saved."}, status=status.HTTP_200_OK)


class AddComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        content = request.data.get("content")
        movie_id = request.data.get("movie")
        parent_id = request.data.get("parent")

        if not content or not movie_id:
            return Response({"detail": "Content and movie ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        movie = get_object_or_404(Movie, id=movie_id)
        parent_comment = None

        if parent_id:
            parent_comment = Comment.objects.filter(id=parent_id).first()
            if not parent_comment:
                return Response({"detail": "Parent comment not found."}, status=status.HTTP_404_NOT_FOUND)

        comment = Comment.objects.create(user=request.user, movie=movie, parent=parent_comment, content=content)
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


class EditComment(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)

        if comment.user != request.user:
            return Response({"detail": "You do not have permission to edit this comment."},
                            status=status.HTTP_403_FORBIDDEN)

        content = request.data.get("content")
        if not content:
            return Response({"detail": "Content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        comment.content = content
        comment.save()
        return Response(CommentSerializer(comment).data, status=status.HTTP_200_OK)


class DeleteComment(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)

        if comment.user != request.user:
            return Response({"detail": "You do not have permission to delete this comment."},
                            status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response({"detail": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class GetMovieComments(APIView):
    def get(self, request, movie_id):
        movie = get_object_or_404(Movie, id=movie_id)
        comments = Comment.objects.filter(movie=movie, parent=None).order_by("-created_at")
        return Response(CommentSerializer(comments, many=True).data)


class CommentRepliesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        replies = comment.replies.all()
        serialized_replies = CommentSerializer(replies, many=True).data
        return Response(serialized_replies, status=status.HTTP_200_OK)
