import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import Navbar from "../components/Navbar.jsx";
import "../styles/MovieDetails.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const isAdmin = user && user.groups && user.groups.includes("Admin");

  useEffect(() => {
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
  }, [id]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="movie-details-container">
        {/* Top content: poster and details side by side */}
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

        {/* Buttons row below the top content */}
        <div className="buttons">
          <Link to="/movies" className="movie-details-button">
            Back
          </Link>
          {isAdmin && (
            <>
              <Link
                to={`/edit-movie/${id}/`}
                className="edit-button movie-details-button"
              >
                <FontAwesomeIcon
                  icon={faPencil}
                  style={{ marginRight: "8px" }}
                />
                Edit Movie
              </Link>
              <button
                onClick={deleteMovie}
                className="delete-button movie-details-button"
              >
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  style={{ marginRight: "8px" }}
                />
                Delete Movie
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
