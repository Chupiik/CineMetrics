import React from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import "../styles/Unauthorized.css";

function Unauthorized() {
  return (
    <div>
      <Navbar />
      <div className="unauthorized-container">
        <h1>Unauthorized</h1>
        <p>You do not have the required permissions to view this page.</p>
        <Link to="/" className="unauthorized-button">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
