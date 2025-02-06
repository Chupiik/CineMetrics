import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import MovieComponent from "../components/MovieComponent.jsx";
import '../styles/Movies.css';
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../context/AuthContext.jsx";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [genre, setGenre] = useState("");
  const [filterChanged, setFilterChanged] = useState(false);

  const { user } = useContext(AuthContext);
  const isAdmin = user && user.groups && user.groups.includes("Admin");

  useEffect(() => {

    setMovies([]);
    setPage(1);
    setHasMore(true);
    getMovies(1);
    setFilterChanged(false);
  }, [searchText, genre]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore &&
        !loadingMore
      ) {
        getMovies(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loadingMore]);

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
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setPage(pageToLoad);
        setLoadingMore(false);
      })
      .catch((err) => {
        alert("Failed to load more movies");
        console.error(err);
        setLoadingMore(false);
      });
  };

  const deleteMovie = (id) => {
    api
      .delete(`/api/movies/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Movie deleted!");
          setMovies((prevMovies) => prevMovies.filter(movie => movie.id !== id));
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
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
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
            <MovieComponent
              key={movie.id}
              movie={movie}
              onDelete={deleteMovie}
            />
          ))}
        </div>
        {loadingMore && <p>Loading more movies...</p>}
        {!hasMore && <p>No more movies to load.</p>}
      </div>
    </div>
  );
}

export default Movies;
