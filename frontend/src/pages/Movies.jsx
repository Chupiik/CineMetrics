import {useState, useEffect} from "react";
import api from "../api"
import Movie from "../components/Movie"
import '../styles/Movies.css';
import Navbar from "../components/Navbar.jsx";


function Movies() {
    const [movies, setMovies] = useState([]);
    const [plot, setPlot] = useState("")
    const [title, setTitle] = useState("")
    const [genres, setGenres] = useState("")
    const [released, setReleased] = useState("")
    const [director, setDirector] = useState("")
    const [posterUrl, setPosterUrl] = useState("");

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

    const createMovie = (e) => {
        e.preventDefault()
        api
            .post("/api/movies/", {title, plot: plot, genres: genres, released: released, director:director, poster:posterUrl})
            .then((res) => {
                if (res.status === 201) alert("Movie created!")
                else alert("Failed to make movie.")
                getMovies();
            })
            .catch((err) => alert(err));
    };

    return<div>
        <Navbar/>
    <div className="container">
        <div>
            <h2>Movies</h2>
            {movies.map((movie) => (<Movie movie={movie} onDelete={deleteMovie} key={movie.id}/>))}
        </div>
        <h2>Add a Movie</h2>
        <form onSubmit={createMovie}>
            <label htmlFor="title">Title:</label>
            <br/>
            <input
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <br/>

            <label htmlFor="genres">Genres:</label>
            <br/>
            <input
                type="text"
                id="genres"
                name="genres"
                onChange={(e) => setGenres(e.target.value)}
                value={genres}
            />
            <br/>

            <label htmlFor="released">Released:</label>
            <br/>
            <input
                type="date"
                id="released"
                name="released"
                onChange={(e) => setReleased(e.target.value)}
                value={released}
            />
            <br/>

            <label htmlFor="director">Director:</label>
            <br/>
            <input
                type="text"
                id="director"
                name="director"
                onChange={(e) => setDirector(e.target.value)}
                value={director}
            />
            <br/>

            <label htmlFor="plot">Plot:</label>
            <br/>
            <textarea
                id="plot"
                name="plot"
                onChange={(e) => setPlot(e.target.value)}
                value={plot}
            />
            <br/>

            <label htmlFor="poster">Poster URL:</label>
            <br/>
            <input
                type="url"
                id="poster"
                name="poster"
                placeholder="Enter poster URL"
                onChange={(e) => setPosterUrl(e.target.value)}
                value={posterUrl}
            />
            <br/>

            {posterUrl && (
                <img
                    className="movie-poster-create"
                    src={posterUrl}
                    alt={`Poster`}
                />
            )}

            <br/>

            <input
                type="submit"
                value="Submit"
            />
        </form>
    </div>
    </div>;
}

export default Movies;