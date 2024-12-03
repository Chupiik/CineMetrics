import { useState, useEffect } from "react";
import api from "../api.js";
import Navbar from "./Navbar.jsx";
import { useNavigate, useParams } from "react-router-dom";  // Added for routing and dynamic id fetching
import "../styles/AddEditMovieForm.css";

function AddEditMovie({ method }) {
  const [title, setTitle] = useState("");
  const [genres, setGenres] = useState("");
  const [released, setReleased] = useState("");
  const [director, setDirector] = useState("");
  const [plot, setPlot] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const name = method === "add" ? "Add a Movie" : "Edit Movie";

  useEffect(() => {
    if (method === "edit" && id) {
      api.get(`/api/movies/${id}/`)
        .then((res) => {
          const movie = res.data;
          setTitle(movie.title);
          setGenres(movie.genres);
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

    const movieData = {
      title,
      genres,
      released,
      director,
      plot,
      poster: posterUrl,
    };

    const apiCall = method === "add"
      ? api.post("/api/movies/", movieData)
      : api.put(`/api/movies/edit/${id}/`, movieData);

    apiCall
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          alert(method === "add" ? "Movie added!" : "Movie updated!");
          if (method !== "add") {
            navigate("/movies");
          }
          resetForm();
        } else {
          alert("Failed to process movie.");
        }
      })
      .catch((err) => alert("Error: " + err.message));
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
      <div className="container">
        <h2>{name}</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <br />
          <label htmlFor="genres">Genres:</label>
          <input
            type="text"
            id="genres"
            name="genres"
            onChange={(e) => setGenres(e.target.value)}
            value={genres}
          />
          <br />
          <label htmlFor="released">Released:</label>
          <input
            type="date"
            required
            id="released"
            name="released"
            onChange={(e) => setReleased(e.target.value)}
            value={released}
          />
          <br />
          <label htmlFor="director">Director:</label>
          <input
            type="text"
            id="director"
            name="director"
            onChange={(e) => setDirector(e.target.value)}
            value={director}
          />
          <br />
          <label htmlFor="plot">Plot:</label>
          <textarea
            id="plot"
            name="plot"
            onChange={(e) => setPlot(e.target.value)}
            value={plot}
          />
          <br />
          <label htmlFor="poster">Poster URL:</label>
          <input
            type="url"
            id="poster"
            name="poster"
            placeholder="Enter poster URL"
            onChange={(e) => setPosterUrl(e.target.value)}
            value={posterUrl}
          />
          <br />
          {posterUrl && (
            <img className="movie-poster-create" src={posterUrl} alt="Poster preview" />
          )}
          <br />
          <button type="submit">{method === "add" ? "Add Movie" : "Update Movie"}</button>
        </form>
      </div>
    </div>
  );
}

export default AddEditMovie;
