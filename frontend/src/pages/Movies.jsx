import {useState, useEffect} from "react";
import api from "../api"
import Movie from "../components/Movie"
import '../styles/Movies.css';
import Navbar from "../components/Navbar.jsx";


function Movies() {
    const [movies, setMovies] = useState([]);
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")

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
            .post("/api/movies/", {name, description})
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
            <label htmlFor="name">Name:</label>
            <br/>
            <input
                type="text"
                id="name"
                name="name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
            />
            <label htmlFor="description">Description:</label>
            <br/>
            <textarea
                id="description"
                name="description"
                required
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />
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