import '../styles/Movie.css';


function Movie({ movie, onDelete }) {
    const formattedDate = new Date(movie.uploaded_at).toLocaleDateString("en-US");

    return (
        <div className="movie-container">
            <p className="movie-name">{movie.title}</p>
            <p className="movie-description">{movie.description}</p>
            <p className="movie-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(movie.id)}>
                Delete
            </button>
        </div>
    );
}

export default Movie;
