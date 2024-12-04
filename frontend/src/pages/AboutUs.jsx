import React from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar is a reusable component
import "../styles/AboutUs.css"

function AboutUs() {
    return (
        <div>
            <Navbar/>

            <div className="aboutUs-container">
                <section className="intro-section">
                    <h2>Welcome to CineMetrics</h2>
                    <p>
                        At CineMetrics, we are passionate about films and dedicated to providing a platform
                        where users can manage and explore their movie collections. Our mission is to help film
                        enthusiasts keep track of their favorite movies, directors, and genres, making movie
                        discovery and organization easy and enjoyable.
                    </p>
                </section>

                <section className="team-section">
                    <h2>Meet Our Team</h2>
                    <div className="team-container">
                        <div className="team-member">
                            <h3>Patrik Chupáč</h3>
                            <p>Founder & Developer</p>
                            <p className="member-info">
                                Patrik is a software engineer with a passion for cinema. He likes building tools
                                that enhance the movie-watching experience.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        We strive to create a user-friendly experience that empowers movie lovers to keep track of
                        their collections, share recommendations, and discover new films based on their interests.
                        Our goal is to foster a community of film enthusiasts who can connect and share their love
                        for cinema.
                    </p>
                </section>

                <section className="contact-section">
                    <h2>Get in Touch</h2>
                    <p>
                        If you have any questions, suggestions, or feedback, feel free to{" "}
                        <a href="#">contact us</a>!
                    </p>
                </section>
            </div>


            <footer>
                <p>&copy; CineMetrics. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default AboutUs;
