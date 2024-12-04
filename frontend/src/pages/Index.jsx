import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../styles/Index.css"
function HomePage() {
    return (
        <div className="body">
            <Navbar/>
            <section className="mainText">
                <div>
                    <h2>Welcome to CineMetrics</h2>
                    <p>Your ultimate destination for all things movies. Discover a multitude of films, check ratings, and explore movie statistics.</p>
                    <Link to="/movies" className="btn">Explore Movies</Link>
                </div>
            </section>

            <section className="features">
                <div className="feature-box">
                    <h3>Discover</h3>
                    <p>Search through a collection of thousands of movies, from all genres and eras, and add your own reviews and ratings.</p>
                </div>
                <div className="feature-box">
                    <h3>Rate</h3>
                    <p>Give your ratings to movies you've seen and help others find great films based on your reviews.</p>
                </div>
                <div className="feature-box">
                    <h3>Explore</h3>
                    <p>Explore a wealth of movie statistics, including personal statistics shown in graphs.</p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
