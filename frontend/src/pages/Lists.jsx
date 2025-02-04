import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import "../styles/Lists.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../context/AuthContext.jsx";

function ListsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/api/movie-lists/")
      .then((response) => {
        setLists(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching your movie lists.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="lists-container">
        <h2>Your Movie Lists</h2>

        <div className="add-list-wrapper">
          <Link to="/add-list">
            <button className="add-list-button">
              <FontAwesomeIcon icon={faCirclePlus} style={{ marginRight: "8px" }} />
              Add List
            </button>
          </Link>
        </div>

        {loading && <p>Loading lists...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <>
            {lists.length === 0 ? (
              <p>You have no movie lists saved.</p>
            ) : (
              <ul className="lists-list">
                {lists.map((list) => (
                  <li key={list.id} className="list-item">
                    <Link to={`/lists/${list.id}`} className="list-link">
                      <div className="list-info">
                        <h3>{list.name}</h3>
                        {list.description && <p>{list.description}</p>}
                      </div>
                    </Link>
                    <div className="list-meta">
                      <p className="list-creator">Created by: <strong>{list.created_by}</strong></p>
                      <p className="list-movie-count">{list.movies.length} Movies</p>
                    </div>
                    {user && user.username === list.created_by ? (
                      <Link to={`/edit-list/${list.id}`} className="edit-list-button">
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </Link>
                    ) : (
                      <button className="edit-list-button disabled" disabled>
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ListsPage;
