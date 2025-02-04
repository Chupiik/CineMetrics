import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import Navbar from "../components/Navbar.jsx";
import "../styles/MovieDetails.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentComponent from "../components/CommentComponent.jsx";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { user } = useContext(AuthContext);
  const isAdmin = user && user.groups && user.groups.includes("Admin");

  useEffect(() => {
    fetchMovieDetails();
    fetchComments();
  }, [id]);

  const fetchMovieDetails = () => {
    api
      .get(`/api/movies/${id}/`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch movie details");
        setLoading(false);
      });
  };

  const fetchComments = () => {
    api
      .get(`/api/movies/${id}/comments/`)
      .then((res) => setComments(res.data))
      .catch(() => console.error("Failed to fetch comments"));
  };

  const deleteMovie = () => {
    api
      .delete(`/api/movies/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          navigate("/movies");
        } else {
          alert("Failed to delete movie.");
        }
      })
      .catch((err) => alert(err));
  };

  const postComment = () => {
    if (!newComment.trim()) return;
    api
      .post(`/api/comments/add/`, { movie: id, content: newComment })
      .then(() => {
        setNewComment("");
        fetchComments();
      })
      .catch(() => alert("Failed to post comment"));
  };

  const handleDeleteComment = (commentId) => {
    setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="movie-details-container">
        <div className="movie-details-content">
          <div className="poster-container">
            <img className="movie-poster" src={movie.poster} alt={movie.title} />
          </div>

          <div className="info-container">
            <h2>{movie.title}</h2>
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((g) => g.name).join(", ")}
            </p>
            <p>
              <strong>Released:</strong> {new Date(movie.released).toLocaleDateString("sk-SK")}
            </p>
            <p>
              <strong>Director:</strong> {movie.director}
            </p>
            <p>
              <strong>Plot:</strong> {movie.plot}
            </p>
          </div>
        </div>

        <div className="buttons">
          <button onClick={() => navigate(-1)} className="movie-details-button">
            Back
          </button>
          {isAdmin && (
            <>
              <Link to={`/edit-movie/${id}/`} className="edit-button movie-details-button">
                <FontAwesomeIcon icon={faPencil} style={{ marginRight: "8px" }} />
                Edit Movie
              </Link>
              <button onClick={deleteMovie} className="delete-button movie-details-button">
                <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "8px" }} />
                Delete Movie
              </button>
            </>
          )}
        </div>

        <div className="comments-section">
          <h3>Comments</h3>

          {user && (
            <div className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
              />
              <button className="submit-comment-button" onClick={postComment}>
                Post Comment
              </button>
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p>No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <CommentComponent
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  movie_id={movie.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
