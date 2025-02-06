import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/AddEditMovieListForm.css";

function AddEditMovieListForm({ method }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authLoading } = useContext(AuthContext);

  const formTitle = method === "add" ? "Create a Movie List" : "Edit Movie List";

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    if (method === "edit" && id) {
      api
        .get(`/api/movie-lists/${id}/`)
        .then((res) => {
          const list = res.data;

          if (list.created_by !== user.username) {
            navigate("/unauthorized");
            return;
          }

          setName(list.name);
          setDescription(list.description || "");
          setIsPublic(list.is_public);
        })
        .catch(() => alert("Failed to fetch list data"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [method, id, user, authLoading, navigate]);

  const validateInputs = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = ["List name is required."];
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessages({});

    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    const listData = {
      name,
      description,
      is_public: isPublic,
    };

    const apiCall =
      method === "add"
        ? api.post("/api/movie-lists/add/", listData)
        : api.put(`/api/movie-lists/edit/${id}/`, listData);

    apiCall
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          navigate(-1);
        } else {
          alert("Failed to process movie list.");
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

  if (authLoading || loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="movieListForm-container">
        <h2>{formTitle}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">List Name:</label>
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

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          {errorMessages.description && (
            <p className="error-message">{errorMessages.description[0]}</p>
          )}

          <label htmlFor="isPublic" className="checkbox-label">
            Public
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </label>

          <button type="submit">
            {method === "add" ? "Create List" : "Update List"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEditMovieListForm;
