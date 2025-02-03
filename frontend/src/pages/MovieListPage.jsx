import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import MovieComponent from "../components/MovieComponent.jsx";
import api from "../api.js";
import "../styles/MovieListPage.css";

function MovieListPage() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/movie-lists/${id}/`)
      .then((response) => {
        setList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching movie list.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="movie-list-container">
        {loading }
        {error && <p className="error-message">{error}</p>}

        {list && (
          <>
            <h2>{list.name}</h2>
            {list.description && <p className="list-description">{list.description}</p>}

            <div className="movies-list">
              {list.movies.length === 0 ? (
                <p>No movies in this list.</p>
              ) : (
                list.movies.map((movie) => (
                  <MovieComponent key={movie.id} movie={movie} />
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
