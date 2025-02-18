import '../styles/MovieComponent.css';
import {Link} from "react-router-dom";
import React, {useContext, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPencil,
    faTrashAlt,
    faSquarePlus,
    faSquareMinus,
    faCalendarAlt,
    faUserTie, faTags, faStar
} from '@fortawesome/free-solid-svg-icons';
import {AuthContext} from "../context/AuthContext.jsx";
import api from "../api.js";

function MovieComponent({movie, onDelete, onRemoveFromList}) {
    const {user} = useContext(AuthContext);
    const isAdmin = user && user.groups && user.groups.includes("Admin");

    const [showDetails, setShowDetails] = useState(false);
    const [showMovieLists, setShowMovieLists] = useState(false);
    const [showRemoveLists, setShowRemoveLists] = useState(false);
    const [movieLists, setMovieLists] = useState([]);
    const [movieInLists, setMovieInLists] = useState([]);
    const [loadingLists, setLoadingLists] = useState(false);
    const [loadingRemoveLists, setLoadingRemoveLists] = useState(false);

    const deleteMovie = (id) => {
        api
            .delete(`/api/movies/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    onDelete(movie.id);
                } else {
                    alert("Failed to delete movie.");
                }
            })
            .catch((err) => alert(err));
    };

    const fetchMovieLists = async () => {
        setLoadingLists(true);
        try {
            const res = await api.get(`/api/movie-lists-created/`);
            const filteredLists = res.data.filter(list =>
                !list.movies.some(m => m.id === movie.id)
            );
            setMovieLists(filteredLists);
        } catch (error) {
            console.error("Error fetching movie lists:", error);
        }
        setLoadingLists(false);
    };

    const fetchMovieInLists = async () => {
        setLoadingRemoveLists(true);
        try {
            const res = await api.get(`/api/movie-lists-created/`);
            const filteredLists = res.data.filter(list =>
                list.movies.some(m => m.id === movie.id)
            );
            setMovieInLists(filteredLists);
        } catch (error) {
            console.error("Error fetching lists containing the movie:", error);
        }
        setLoadingRemoveLists(false);
    };

    const addToMovieList = async (listId) => {
        try {
            const res = await api.post(`/api/movie-lists/${listId}/add/`, {movie: movie.id});
            if (!(res.status === 200 || res.status === 201)) {
                alert("Failed to add movie to list.");
            }
        } catch (error) {
            console.error("Error adding movie to list:", error);
            alert("Error adding movie to list.");
        }
        setShowMovieLists(false);
    };

    const removeFromMovieList = async (listId) => {
        try {
            await api.post(`/api/movie-lists/${listId}/remove/`, {movie: movie.id});
            setMovieInLists(prevLists => prevLists.filter(list => list.id !== listId));
            if (onRemoveFromList) {
                onRemoveFromList(movie.id);
            }
        } catch (error) {
            console.error("Error removing movie from list:", error);
            alert("Error removing movie from list.");
        }
        setShowRemoveLists(false);
    };

    return (
        <div>
            <div className="movie-container">
                <div
                    onMouseEnter={() => setShowDetails(true)}
                    onMouseLeave={() => setShowDetails(false)}
                >
                    {user && (
                        <div className="movie-list-actions">
                            <div
                                className="dropdown-wrapper"
                                onMouseEnter={() => {
                                    fetchMovieLists();
                                    setShowMovieLists(true);
                                }}
                                onMouseLeave={() => setShowMovieLists(false)}
                            >
                                <button className="movie-add-button">
                                    <FontAwesomeIcon icon={faSquarePlus}/>
                                </button>
                                {showMovieLists && (
                                    <div className="movie-lists-dropdown">
                                        {loadingLists ? (
                                            <p>Loading...</p>
                                        ) : (
                                            movieLists.length > 0 ? (
                                                movieLists.map(list => (
                                                    <div
                                                        key={list.id}
                                                        className="movie-list-option"
                                                        onClick={() => addToMovieList(list.id)}
                                                    >
                                                        {list.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No movie lists found.</p>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            <div
                                className="dropdown-wrapper"
                                onMouseEnter={() => {
                                    fetchMovieInLists();
                                    setShowRemoveLists(true);
                                }}
                                onMouseLeave={() => setShowRemoveLists(false)}
                            >
                                <button className="movie-remove-button">
                                    <FontAwesomeIcon icon={faSquareMinus}/>
                                </button>
                                {showRemoveLists && (
                                    <div className="movie-lists-dropdown">
                                        {loadingRemoveLists ? (
                                            <p>Loading...</p>
                                        ) : (
                                            movieInLists.length > 0 ? (
                                                movieInLists.map(list => (
                                                    <div
                                                        key={list.id}
                                                        className="movie-list-option"
                                                        onClick={() => removeFromMovieList(list.id)}
                                                    >
                                                        {list.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Not in any list.</p>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <Link to={`/movies/${movie.id}`} key={movie.id}>
                        <div className="movie-poster-container">
                            {(movie.poster_uploaded || movie.poster) && (
                                <img
                                    className="movie-poster"
                                    src={movie.poster_uploaded ? movie.poster_uploaded : movie.poster}
                                    alt={`Poster of ${movie.title}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "http://localhost:8000/media/movie_posters/placeholder.png";
                                    }}

                                />
                            )}
                        </div>
                        <p className="movie-title">{movie.title}</p>
                    </Link>
                </div>


                {showDetails && (
                    <div className="movie-details">
                        <p className="info-details-item">
                            <FontAwesomeIcon icon={faTags} className="info-details-icon"/>
                            <span>{movie.genres.map(g => g.name).join(", ")}
      </span>
                        </p>
                        <p className="info-details-item">
                            <FontAwesomeIcon icon={faCalendarAlt} className="info-details-icon"/>
                            <span>
        {new Date(movie.released).toLocaleDateString("sk-SK")}
      </span>
                        </p>
                        <p className="info-details-item">
                            <FontAwesomeIcon icon={faUserTie} className="info-details-icon"/>
                            <span>
        {movie.director || "No information"}
      </span>
                        </p>
                        <p className="info-details-item">
                            <FontAwesomeIcon icon={faStar} className="info-details-icon"/>
                            <span>
        {movie.imdb_rating || "No information"}
      </span>
                        </p>
                    </div>
                )}

            </div>
            {isAdmin && (
                <div className="movie-actions">
                    <Link to={`/edit-movie/${movie.id}`}>
                        <button className="movie-edit-button movie-button">
                            <FontAwesomeIcon icon={faPencil}/>
                        </button>
                    </Link>
                    <button className="movie-delete-button movie-button" onClick={() => deleteMovie(movie.id)}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </button>
                </div>
            )}


        </div>
    );
}

export default MovieComponent;
