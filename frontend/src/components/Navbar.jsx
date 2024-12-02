import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Create this file for Navbar-specific styles

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-logo">
                <h1>CineMetrics</h1>
            </div>
            <nav className="navbar-links">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/movies">Browse Movies</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
