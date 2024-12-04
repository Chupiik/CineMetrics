import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Ensure you update the CSS file

function Navbar() {
    const isAuthenticated = !!localStorage.getItem("access");

    return (
        <header className="navbar">
            <div className="navbar-logo">
                <h1>CineMetrics</h1>
            </div>
            <nav className="navbar-links">
                <ul className="navbar-menu">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/movies">Browse Movies</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                </ul>
            </nav>
            <div className="navbar-buttons">
                {!isAuthenticated && (
                    <>
                        <Link to="/login">
                            <button className="login-button">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="register-button">Register</button>
                        </Link>
                    </>
                )}
                {isAuthenticated && (
                    <Link to="/logout">
                        <button className="logout-button">Logout</button>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Navbar;
