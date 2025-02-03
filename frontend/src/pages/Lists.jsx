import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import "../styles/Lists.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

function ListsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/movie-lists/")
      .then((response) => {
        setLists(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching your movie lists.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="lists-container">
        <h2>Your Movie Lists</h2>

        {/* Add List Button */}
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
                    <Link to={`/lists/${list.id}`} key={list.id}>
                  <li className="list-item">
                      <h3>{list.name}</h3>
                      {list.description && <p>{list.description}</p>}
                  </li>
                      </Link>
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
