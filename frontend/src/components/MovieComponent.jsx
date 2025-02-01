import '../styles/MovieComponent.css';
import { Link } from "react-router-dom";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

function MovieComponent({ movie, onDelete }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.groups && user.groups.includes("Admin");

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovieDetails = async () => {
    if (details || loading) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/movies/${movie.id}`);
      const data = await response.data;
      setDetails(data);
    } catch (error) {
      console.error("Error when loading movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
    <div
      className="movie-container"
      onMouseEnter={fetchMovieDetails}
      onMouseLeave={() => setDetails(null)}
    >
      <div className="movie-poster-container">
        {movie.poster && (
          <img
            className="movie-poster"
            src={movie.poster}
            alt={`Poster of ${movie.title}`}
          />
        )}
      </div>

      <p className="movie-title">{movie.title}</p>
        {details && (
        <div className="movie-details">
          <p className="movie-genres">
            {details.genres.map(g => g.name).join(", ")}
          </p>
          <p className="movie-release-date">
            {new Date(details.released).toLocaleDateString("sk-SK")}
          </p>
        </div>
      )}
    </div>
            {isAdmin && (
        <div className="movie-actions">
          <Link to={`/edit-movie/${movie.id}`}>
            <button className="edit-button movie-button">
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </Link>
          <button className="delete-button movie-button" onClick={() => onDelete(movie.id)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      )}
          </div>
  );
}

export default MovieComponent;
