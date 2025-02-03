import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import "../styles/AddList.css";

function AddMovieList() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessages({});

    const listData = {
      name,
      description,
      is_public: isPublic,
    };

    api
      .post("/api/movie-lists/add/", listData)
      .then((res) => {
        if (res.status === 201) {
          alert("Movie list created!");
          navigate("/lists");
        } else {
          alert("Failed to create movie list.");
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

  return (
    <div>
      <Navbar />
      <div className="movieListForm-container">
        <h2>Create a New Movie List</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">List Name:</label>
          <br />
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {errorMessages.name && (
            <p className="error-message">{errorMessages.name[0]}</p>
          )}
          <br />

          <label htmlFor="description">Description:</label>
          <br />
          <textarea
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          {errorMessages.description && (
            <p className="error-message">{errorMessages.description[0]}</p>
          )}
          <br />

          <label htmlFor="isPublic">Public:</label>
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <br /><br />

          <button type="submit">Create List</button>
        </form>
      </div>
    </div>
  );
}

export default AddMovieList;
