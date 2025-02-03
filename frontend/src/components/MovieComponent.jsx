import '../styles/MovieComponent.css';
import { Link } from "react-router-dom";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashAlt, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

function MovieComponent({ movie, onDelete }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.groups && user.groups.includes("Admin");

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showMovieLists, setShowMovieLists] = useState(false);
  const [movieLists, setMovieLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

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

  const toggleMovieLists = async () => {
    if (!showMovieLists) {
      setLoadingLists(true);
      try {
        const res = await api.get(`/api/movie-lists/`);
        setMovieLists(res.data);
      } catch (error) {
        console.error("Error fetching movie lists:", error);
      }
      setLoadingLists(false);
    }
    setShowMovieLists(!showMovieLists);
  };

  const addToMovieList = async (listId) => {
    try {
      const res = await api.post(`/api/movie-lists/${listId}/add/`, { movie: movie.id });
      if (res.status === 200 || res.status === 201) {
      } else {
        alert("Failed to add movie to list.");
      }
    } catch (error) {
      console.error("Error adding movie to list:", error);
      alert("Error adding movie to list.");
    }
    setShowMovieLists(false);
  };

  return (
      <div>
    <div
      className="movie-container"
      onMouseEnter={fetchMovieDetails}
      onMouseLeave={() => setDetails(null)}
    >
      {user && (
        <div className="movie-add-to-list">
          <button className="movie-add-button" onClick={toggleMovieLists}>
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
          {showMovieLists && (
            <div className="movie-lists-dropdown">
              {loadingLists ? (
                <p>Loading...</p>
              ) : (
                movieLists.length > 0 ? (
                  movieLists.map(list => (
                    <div
                      key={list.id}
                      className="movie-list-option"
                      onClick={() => addToMovieList(list.id)}
                    >
                      {list.name}
                    </div>
                  ))
                ) : (
                  <p>No movie lists found.</p>
                )
              )}
            </div>

          )}
        </div>
      )}

      <Link to={`/movies/${movie.id}`} key={movie.id}>
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
      </Link>
      </div>

            {isAdmin && (
        <div className="movie-actions">
          <Link to={`/edit-movie/${movie.id}`}>
            <button className="movie-edit-button movie-button">
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </Link>
          <button className="movie-delete-button movie-button" onClick={() => onDelete(movie.id)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      )}
      </div>
  );
}

export default MovieComponent;
