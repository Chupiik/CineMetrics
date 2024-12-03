import '../styles/Movie.css';
import { Link } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Movie({ movie, onDelete }) {
    const formattedDate = new Date(movie.released).toLocaleDateString("sk-SK");

    return (
        <div className="movie-container">
            <div className="movie-details-poster">
                <div className="movie-details">
                    <p className="movie-title">{movie.title}</p>
                    <p className="movie-genres">Genres: {movie.genres}</p>
                    <p className="movie-release-date">Released: {formattedDate}</p>
                    <p className="movie-director">Director: {movie.director}</p>
                    <p className="movie-plot">Plot: {movie.plot}</p>
                </div>
                {movie.poster && (
                    <img
                        className="movie-poster"
                        src={movie.poster}
                        alt={`Poster of ${movie.title}`}
                    />
                )}
            </div>

            {/* Button Container */}
            <div className="movie-actions">
                <Link to={`/edit-movie/${movie.id}`}>
                    <button className="edit-button">
                        <FontAwesomeIcon icon={faPencil} />  Edit
                    </button>
                </Link>

                <button className="delete-button" onClick={() => onDelete(movie.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />Delete
                </button>
            </div>
        </div>
    );
}

export default Movie;
