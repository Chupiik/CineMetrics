import { useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/AddMoviePage.css";

const AddMoviePage = () => {
  const [title, setTitle] = useState("");
  const [genres, setGenres] = useState("");
  const [released, setReleased] = useState("");
  const [director, setDirector] = useState("");
  const [plot, setPlot] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

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

    api
      .post("/api/movies/", movieData)
      .then((res) => {
        if (res.status === 201) {
          alert("Movie added!");
          resetForm();
        } else {
          alert("Failed to add movie.");
        }
      })
      .catch((err) => alert(err.message));
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
        <h2>Add a Movie</h2>
        <br/>
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
          <br/>
          <label htmlFor="genres">Genres:</label>
          <input
              type="text"
              id="genres"
              name="genres"
              onChange={(e) => setGenres(e.target.value)}
              value={genres}
          />
          <br/>
          <label htmlFor="released">Released:</label>
          <input
              type="date"
              id="released"
              name="released"
              onChange={(e) => setReleased(e.target.value)}
              value={released}
          />
          <br/>
          <label htmlFor="director">Director:</label>
          <input
              type="text"
              id="director"
              name="director"
              onChange={(e) => setDirector(e.target.value)}
              value={director}
          />
          <br/>
          <label htmlFor="plot">Plot:</label>
          <textarea
              id="plot"
              name="plot"
              onChange={(e) => setPlot(e.target.value)}
              value={plot}
          />
          <br/>
          <label htmlFor="poster">Poster URL:</label>
          <input
              type="url"
              id="poster"
              name="poster"
              placeholder="Enter poster URL"
              onChange={(e) => setPosterUrl(e.target.value)}
              value={posterUrl}
          />
          <br/>
          {posterUrl && (
              <img className="movie-poster-create" src={posterUrl} alt="Poster preview"/>
          )}
          <br/>
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddMoviePage;
