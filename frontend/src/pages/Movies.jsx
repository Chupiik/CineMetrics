import React, { useState, useEffect, useContext, useRef } from "react";
import api from "../api";
import MovieComponent from "../components/MovieComponent.jsx";
import "../styles/Movies.css";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext.jsx";
import { throttle } from "lodash";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const { user } = useContext(AuthContext);
  const isAdmin = user && user.groups && user.groups.includes("Admin");




  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    getMovies(1);
  }, [searchText, genre]);

  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!hasMore) return;

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;

      if (nearBottom) {

        getMovies(page + 1);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [page, hasMore]);

  const getMovies = (pageToLoad) => {
    setLoadingMore(true);

    let query = `/api/movies/?page=${pageToLoad}&limit=20`;
    if (searchText) {
      query += `&search=${encodeURIComponent(searchText)}`;
    }
    if (genre) {
      query += `&genre=${encodeURIComponent(genre)}`;
    }

    api
      .get(query)
      .then((res) => {
        const newMovies = res.data.movies || res.data;
        if (newMovies.length < 20) {
          setHasMore(false);
        }
        setMovies((prev) => [...prev, ...newMovies]);
        setPage(pageToLoad);
        setLoadingMore(false);
      })
      .catch((err) => {
        alert("Failed to load more movies");
        console.error(err);
        setLoadingMore(false);
      });
  };

  const getGenres = () => {
    api
      .get("/api/genres/")
      .then((res) => setGenres(res.data))
      .catch((err) => console.error("Failed to load genres", err));
  };

  const deleteMovie = (id) => {
    api
      .delete(`/api/movies/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Movie deleted!");
          setMovies((prev) => prev.filter((movie) => movie.id !== id));
        } else {
          alert("Failed to delete movie.");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by title, director..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="filter-input"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <Link to="/add-movie">
            <button className="add-movie-button">
              <FontAwesomeIcon icon={faCirclePlus} /> Add Movie
            </button>
          </Link>
        )}
        <div className="movies-list">
          {movies.map((movie) => (
            <MovieComponent key={movie.id} movie={movie} onDelete={deleteMovie} />
          ))}
        </div>
        {loadingMore && <p>Loading more movies...</p>}
        {!hasMore && <p>No more movies to load.</p>}
      </div>
    </div>
  );
}

export default Movies;
