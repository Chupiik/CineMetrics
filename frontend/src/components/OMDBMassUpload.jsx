import React, {useState} from "react";
import api from "../api.js";
import "../styles/OMDBMassUpload.css";
import Navbar from "./Navbar.jsx";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function OMDBMassUpload() {
  const [query, setQuery] = useState("");
  const [apikey, setApikey] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors("");
    setProgress([]);

    try {
      const payload = { query, apikey };
      const response = await api.post("/api/omdb-mass-upload/", payload, {
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });
      setMessage(response.data.message);
      setProgress(response.data.processing_messages || []);
    } catch (err) {
      console.error("Error uploading movies:", err);
      setErrors(
        err.response && err.response.data
          ? JSON.stringify(err.response.data)
          : "An error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
      <>
      <Navbar/>
    <div className="omdb-mass-upload-container">
      <h1>OMDb Mass Upload</h1>
      {loading && <p>Uploading movies...</p>}
      {message && <p className="success-message">{message}</p>}
      {errors && <p className="error-message">{errors}</p>}
      <form onSubmit={handleSubmit} className="omdb-mass-upload-form">
        <div className="form-group">
          <label htmlFor="query">Search Query:</label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search term (e.g., Batman)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apikey">OMDb API Key:</label>
          <input
            type="text"
            id="apikey"
            value={apikey}
            onChange={(e) => setApikey(e.target.value)}
            placeholder="Enter your OMDb API key"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Movies"}
        </button>
      </form>
      <div className="progress">
        {progress.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
        </>
  );
}

export default OMDBMassUpload;