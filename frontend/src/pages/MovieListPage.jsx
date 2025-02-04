import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar.jsx";
import MovieComponent from "../components/MovieComponent.jsx";
import api from "../api.js";
import "../styles/MovieListPage.css";
import { AuthContext } from "../context/AuthContext.jsx"; // Import Auth Context

function MovieListPage() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Get logged-in user

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = () => {
    api
      .get(`/api/movie-lists/${id}/`)
      .then((response) => {
        setList(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching movie list.");
        setLoading(false);
      });
  };

  const handleRemoveMovie = (movieId) => {
    setList((prevList) => ({
      ...prevList,
      movies: prevList.movies.filter((movie) => movie.id !== movieId),
    }));
  };

  return (
    <div>
      <Navbar />
      <div className="movie-list-container">
        {loading}
        {error && <p className="error-message">{error}</p>}

        {list && (
          <>
            <div className="list-header">
              <h2>{list.name}</h2>
              {user && user.username === list.created_by ? (
                <Link to={`/edit-list/${id}`} className="edit-list-button">
                  <FontAwesomeIcon icon={faPencil} />
                </Link>
              ) : (
                <button className="edit-list-button disabled" disabled>
                  <FontAwesomeIcon icon={faPencil} />
                </button>
              )}
            </div>

            {list.description && <p className="list-description">{list.description}</p>}

            <div className="movies-list">
              {list.movies.length === 0 ? (
                <p>No movies in this list.</p>
              ) : (
                list.movies.map((movie) => (
                  <MovieComponent key={movie.id} movie={movie} onRemoveFromList={handleRemoveMovie} />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieListPage;
