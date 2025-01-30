import React, {useState, useEffect, useContext} from "react";
import api from "../api"
import Movie from "../components/Movie"
import '../styles/Movies.css';
import Navbar from "../components/Navbar.jsx";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import {AuthContext} from "../context/AuthContext.jsx";


function Movies() {
    const [movies, setMovies] = useState([]);
    const { user } = useContext(AuthContext);
    const isAdmin = user && user.groups && user.groups.includes("Admin");

    useEffect(() => {
        getMovies();

    }, []);
    const getMovies = () => {
        api
            .get("/api/movies/")
            .then((res) => res.data)
            .then((data) => {setMovies(data); console.log(data)})
            .catch((err) => alert(err));
    }

    const deleteMovie = (id) => {
        api
            .delete(`/api/movies/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Movie deleted!")
                else alert("Failed to delete movie.")
                getMovies();
            }).catch((err) => alert(err));
    }

    return<div>
        <Navbar/>
    <div className="container">
        <div>
            {isAdmin && (
                <Link to="/add-movie">
                    <button className="add-movie-button">
                        <FontAwesomeIcon icon={faCirclePlus} />
                        Add Movie
                    </button>
                </Link>
            )}
            {movies.map((movie) => (<Movie movie={movie} onDelete={deleteMovie} key={movie.id}/>))}
        </div>
    </div>
    </div>;
}

export default Movies;