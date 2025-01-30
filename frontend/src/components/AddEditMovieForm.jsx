import { useState, useEffect } from "react";
import api from "../api.js";
import Navbar from "./Navbar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddEditMovieForm.css";

function AddEditMovie({ method }) {
  const [title, setTitle] = useState("");
  const [genres, setGenres] = useState("");
  const [released, setReleased] = useState("");
  const [director, setDirector] = useState("");
  const [plot, setPlot] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  const [errorMessages, setErrorMessages] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  const name = method === "add" ? "Add a Movie" : "Edit Movie";

  useEffect(() => {
    if (method === "edit" && id) {
      api
        .get(`/api/movies/${id}/`)
        .then((res) => {
          const movie = res.data;
          setTitle(movie.title);
          setGenres(movie.genres.map((genre) => genre.name).join(", "));
          setReleased(movie.released);
          setDirector(movie.director);
          setPlot(movie.plot);
          setPosterUrl(movie.poster);
        })
        .catch((err) => alert("Failed to fetch movie data"));
    }
  }, [method, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessages({});

  const genreObjects = genres
    .split(",")
    .map((genre) => genre.trim())
    .filter((genre) => genre)
    .map((name) => ({ name }));

    const movieData = {
      title,
      genres: genreObjects,
      released,
      director,
      plot,
      poster: posterUrl,
    };

    const apiCall =
      method === "add"
        ? api.post("/api/movies/add/", movieData)
        : api.put(`/api/movies/edit/${id}/`, movieData);
    apiCall
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          alert(method === "add" ? "Movie added!" : "Movie updated!");
          if (method !== "add") {
            navigate("/movies/");
          }
          resetForm();
        } else {
          alert("Failed to process movie.");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setErrorMessages(err.response.data);
        } else {
          alert("Error: " + err.message);
        }
      });
  };


  const resetForm = () => {
    setTitle("");
    setGenres("");
    setReleased("");
    setDirector("");
    setPlot("");
    setPosterUrl("");
  };

  return (
    <div>
      <Navbar />
      <div className="movieForm-container">
        <h2>{name}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <br/>
          <input
              type="text"
              id="title"
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
          />
          {errorMessages.title && (
              <p className="error-message">{errorMessages.title[0]}</p>
          )}
          <br/>
          <label htmlFor="genres">Genres (comma separated):</label>
          <br/>
          <input
              type="text"
              id="genres"
              onChange={(e) => setGenres(e.target.value)}
              value={genres}
          />
          {errorMessages.genres &&  (
              <p className="error-message">{errorMessages.genres[0]}</p>
          )}
          <br/>
          <label htmlFor="released">Released:</label>
          <br/>
          <input
              type="date"
              required
              id="released"
              name="released"
              onChange={(e) => setReleased(e.target.value)}
              value={released}
          />
          {errorMessages.released && (
              <p className="error-message">{errorMessages.released[0]}</p>
          )}
          <br/>
          <label htmlFor="director">Director:</label>
          <br/>
          <input
              type="text"
              id="director"
              name="director"
              onChange={(e) => setDirector(e.target.value)}
              value={director}
          />
          {errorMessages.director && (
              <p className="error-message">{errorMessages.director[0]}</p>
          )}
          <br/>
          <label htmlFor="plot">Plot:</label>
          <br/>
          <textarea
              id="plot"
              name="plot"
              onChange={(e) => setPlot(e.target.value)}
              value={plot}
          />
          {errorMessages.plot && (
              <p className="error-message">{errorMessages.plot[0]}</p>
          )}
          <br/>
          <label htmlFor="poster">Poster URL:</label>
          <br/>
          <input
              type="url"
              id="poster"
              name="poster"
              placeholder="Enter poster URL"
              onChange={(e) => setPosterUrl(e.target.value)}
              value={posterUrl}
          />
          {errorMessages.poster && (
              <p className="error-message">{errorMessages.poster[0]}</p>
          )}
          <br/>
          {posterUrl && (
              <img className="movie-poster-create" src={posterUrl} alt="Poster preview"/>
          )}
          <br/>
          <button type="submit">{method === "add" ? "Add Movie" : "Update Movie"}</button>
        </form>
      </div>
    </div>
  );
}

export default AddEditMovie;
