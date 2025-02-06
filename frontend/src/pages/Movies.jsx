import React, {useState, useEffect, useContext} from "react";
import api from "../api";
import MovieComponent from "../components/MovieComponent.jsx";
import "../styles/Movies.css";
import Navbar from "../components/Navbar.jsx";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../context/AuthContext.jsx";
import {throttle} from "lodash";

function Movies() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [genre, setGenre] = useState("");
    const [genres, setGenres] = useState([]);


    const [orderBy, setOrderBy] = useState("");
    const [orderDirection, setOrderDirection] = useState("asc");

    const {user} = useContext(AuthContext);
    const isAdmin = user && user.groups && user.groups.includes("Admin");


    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        getMovies(1);
    }, [searchText, genre, orderBy, orderDirection]);

    useEffect(() => {
        getGenres();
    }, []);

    useEffect(() => {
        const handleScroll = throttle(() => {
            if (!hasMore) return;

            const nearBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;

            if (nearBottom) {
                getMovies(page + 1);
            }
        }, 50);

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            handleScroll.cancel();
        };
    }, [page, hasMore]);

    const getMovies = (pageToLoad) => {
        setLoadingMore(true);

        let query = `/api/movies/?page=${pageToLoad}&limit=20`;
        if (searchText) {
            query += `&search=${encodeURIComponent(searchText)}`;
        }
        if (genre) {
            query += `&genre=${encodeURIComponent(genre)}`;
        }
        if (orderBy) {
            const ordering = orderDirection === "asc" ? orderBy : `-${orderBy}`;
            query += `&ordering=${ordering}`;
        }

        api
            .get(query)
            .then((res) => {
                const newMovies = res.data.movies || res.data;
                if (newMovies.length < 20) {
                    setHasMore(false);
                }
                setMovies((prev) => {
                    const existingIds = new Set(prev.map((m) => m.id));
                    const uniqueNewMovies = newMovies.filter((movie) => !existingIds.has(movie.id));
                    if (newMovies.length < 20) {
                        setHasMore(false);
                    }
                    return [...prev, ...uniqueNewMovies];
                });

                setPage(pageToLoad);
                setLoadingMore(false);
            })
            .catch((err) => {
                alert("Failed to load more movies");
                console.error(err);
                setLoadingMore(false);
            });
    };

    const getGenres = () => {
        api
            .get("/api/genres/")
            .then((res) => setGenres(res.data))
            .catch((err) => console.error("Failed to load genres", err));
    };

    const deleteMovie = (id) => {
        setMovies((prev) => prev.filter((movie) => movie.id !== id));
    };

    return (
        <div>
            <Navbar/>
            <div className="container">
                <div className="filters">
                    Filters:
                    <input
                        type="text"
                        placeholder="Search by title, director..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="filter-input"
                    />

                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Genres</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.name}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                    Ordering:
                    <select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Order By</option>
                        <option value="title">Title</option>
                        <option value="released">Release Date</option>
                        <option value="imdb_rating">IMDb Rating</option>
                        <option value="director">Director</option>
                        <option value="runtime_min">Runtime</option>
                    </select>

                    <select
                        value={orderDirection}
                        onChange={(e) => setOrderDirection(e.target.value)}
                        className="filter-select"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                {isAdmin && (
                    <Link to="/add-movie">
                        <button className="add-movie-button">
                            <FontAwesomeIcon icon={faCirclePlus}/> Add Movie
                        </button>
                    </Link>
                )}

                <div className="movies-list">
                    {movies.map((movie) => (
                        <MovieComponent key={movie.id} movie={movie} onDelete={deleteMovie}/>
                    ))}
                </div>
                {loadingMore && <p className="EndTextMovies">Loading more movies...</p>}
                {!hasMore && <p className="EndTextMovies">No more movies to load.</p>}
            </div>
        </div>
    );
}

export default Movies;
