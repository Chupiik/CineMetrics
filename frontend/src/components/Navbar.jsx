import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faFilm,
    faInfoCircle,
    faListUl,
    faSignInAlt,
    faUserPlus,
    faSignOutAlt, faClapperboard
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Navbar.css";

function Navbar() {
  const isAuthenticated = !!localStorage.getItem("access");
  const username = localStorage.getItem("username");

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <h1>
            <FontAwesomeIcon icon={faClapperboard} style={{ marginRight: "10px" }} />
            CineMetrics
          </h1>
        </Link>
      </div>
      <nav className="navbar-links">
        <ul className="navbar-menu">
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} style={{ marginRight: "5px" }} />
              Home
            </Link>
          </li>
          <li>
            <Link to="/movies">
              <FontAwesomeIcon icon={faFilm} style={{ marginRight: "5px" }} />
              Browse Movies
            </Link>
          </li>
          <li>
            <Link to="/about">
              <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: "5px" }} />
              About Us
            </Link>
          </li>
        </ul>
      </nav>
      <div className="navbar-buttons">
        {!isAuthenticated && (
          <>
            <Link to="/login">
              <button className="login-button">
                <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: "5px" }} />
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="register-button">
                <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "5px" }} />
                Register
              </button>
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/lists">
              <button className="lists-button">
                <FontAwesomeIcon icon={faListUl} style={{ marginRight: "5px" }} />
                My Lists
              </button>
            </Link>
            <p className="username-text">{username}</p>
            <Link to="/logout">
              <button className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: "5px" }} />
                Logout
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
