import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import Navbar from "../components/Navbar.jsx";
import MovieComponent from "../components/MovieComponent.jsx";
import api from "../api.js";
import "../styles/MovieListPage.css";
import { AuthContext } from "../context/AuthContext.jsx";

function MovieListPage() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const { user, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, [id, user, authLoading]);

  const fetchList = () => {
    if (authLoading) return;
    if (!user) return;

    api.get(`/api/movie-lists/${id}/`)
      .then(response => {
        const listData = response.data;

        if (!listData.is_public && listData.created_by !== user.username) {
          navigate("/unauthorized");
          return;
        }

        setList(listData);
        setIsSaved(listData.users.includes(user.id));
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching movie list.");
        setLoading(false);
      });
  };

  const toggleSaveList = () => {
    const endpoint = isSaved
      ? `/api/movie-lists/${id}/unsave/`
      : `/api/movie-lists/${id}/save/`;

    api.post(endpoint)
      .then(() => {
        setIsSaved(!isSaved);
      })
      .catch(() => console.error("Error saving/un-saving list"));
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
              <div className="list-actions">
                {user && user.username === list.created_by ? (
                  <Link to={`/edit-list/${id}`} className="edit-list-button">
                    <FontAwesomeIcon icon={faPencil} />
                  </Link>
                ) : (
                  <button className="edit-list-button disabled" disabled>
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                )}

                <button className="favorite-button" onClick={toggleSaveList}>
                  <FontAwesomeIcon icon={isSaved ? solidHeart : regularHeart} />
                </button>
              </div>
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
