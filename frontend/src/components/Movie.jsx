import '../styles/Movie.css';
import { FaTrashAlt } from 'react-icons/fa';


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

            <button className="delete-button" onClick={() => onDelete(movie.id)}>
                <FaTrashAlt/> Delete
            </button>
        </div>
    );
}

export default Movie;
