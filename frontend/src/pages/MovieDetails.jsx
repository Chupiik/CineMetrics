import React, {useState, useEffect, useContext} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import api from "../api.js";
import Navbar from "../components/Navbar.jsx";
import "../styles/MovieDetails.css";
import {AuthContext} from "../context/AuthContext.jsx";
import {faPencil, faTrashAlt, faSquarePlus, faSquareMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CommentComponent from "../components/CommentComponent.jsx";
import ReviewComponent from "../components/ReviewComponent.jsx";

function MovieDetails() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");


    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newReviewRating, setNewReviewRating] = useState(1);
    const [newReviewText, setNewReviewText] = useState("");

    const [showMovieLists, setShowMovieLists] = useState(false);
    const [showRemoveLists, setShowRemoveLists] = useState(false);
    const [movieLists, setMovieLists] = useState([]);
    const [movieInLists, setMovieInLists] = useState([]);
    const [loadingLists, setLoadingLists] = useState(false);
    const [loadingRemoveLists, setLoadingRemoveLists] = useState(false);

    const {user} = useContext(AuthContext);
    const isAdmin = user && user.groups && user.groups.includes("Admin");

    useEffect(() => {
        fetchMovieDetails();
        fetchComments();
        fetchReviews();
    }, [id]);

    const fetchMovieDetails = () => {
        api
            .get(`/api/movies/${id}/`)
            .then((res) => {
                setMovie(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch movie details");
                setLoading(false);
            });
    };

    const fetchComments = () => {
        api
            .get(`/api/movies/${id}/comments/`)
            .then((res) => setComments(res.data))
            .catch(() => console.error("Failed to fetch comments"));
    };

    const fetchReviews = () => {
        api
            .get(`/api/movies/${id}/reviews/`)
            .then((res) => {
                setReviews(res.data.reviews);
                setAverageRating(res.data.average_rating);
            })
            .catch((err) => console.error("Failed to fetch reviews", err));
    };

    const fetchMovieLists = async () => {
        setLoadingLists(true);
        try {
            const res = await api.get(`/api/movie-lists-created/`);
            const filteredLists = res.data.filter(
                (list) => !list.movies.some((m) => m.id === movie.id)
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
            // Filter lists that do contain this movie.
            const filteredLists = res.data.filter((list) =>
                list.movies.some((m) => m.id === movie.id)
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
        } catch (error) {
            console.error("Error removing movie from list:", error);
            alert("Error removing movie from list.");
        }
        setShowRemoveLists(false);
    };

    const deleteMovie = () => {
        api
            .delete(`/api/movies/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    navigate("/movies");
                } else {
                    alert("Failed to delete movie.");
                }
            })
            .catch((err) => alert(err));
    };

    const postComment = () => {
        if (!newComment.trim()) return;
        api
            .post(`/api/comments/add/`, {movie: id, content: newComment})
            .then(() => {
                setNewComment("");
                fetchComments();
            })
            .catch(() => alert("Failed to post comment"));
    };

    const handleDeleteComment = (commentId) => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    const userHasReviewed = user && reviews.some((rev) => rev.user === user.username);

    const postReview = () => {
        if (userHasReviewed) {
            alert("You have already reviewed this movie.");
            return;
        }
        api
            .post(`/api/movies/${id}/reviews/create/`, {
                rating: newReviewRating,
                text: newReviewText,
                movie: movie.id,
            })
            .then(() => {
                setNewReviewRating(1);
                setNewReviewText("");
                fetchReviews();
            })
            .catch(() => alert("Failed to post review"));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <Navbar/>
            <div className="movie-details-container">
                <div className="movie-details-content">
                    <div className="poster-container">
                        <img
                            className="movie-poster"
                            src={movie.poster}
                            alt={movie.title}
                        />
                        {user && (
                            <div>
                                <div
                                    className="dropdown-details-wrapper"
                                    onMouseEnter={() => {
                                        fetchMovieLists();
                                        setShowMovieLists(true);
                                    }}
                                    onMouseLeave={() => setShowMovieLists(false)}
                                >
                                    <button className="movie-details-add-button">
                                        <FontAwesomeIcon icon={faSquarePlus}/>
                                    </button>
                                    {showMovieLists && (
                                        <div className="movie-details-lists-dropdown">
                                            {loadingLists ? (
                                                <p>Loading...</p>
                                            ) : (
                                                movieLists.length > 0 ? (
                                                    movieLists.map((list) => (
                                                        <div
                                                            key={list.id}
                                                            className="movie-details-list-option"
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
                                    className="dropdown-details-wrapper"
                                    onMouseEnter={() => {
                                        fetchMovieInLists();
                                        setShowRemoveLists(true);
                                    }}
                                    onMouseLeave={() => setShowRemoveLists(false)}
                                >
                                    <button className="movie-details-remove-button">
                                        <FontAwesomeIcon icon={faSquareMinus}/>
                                    </button>
                                    {showRemoveLists && (
                                        <div className="movie-details-lists-dropdown">
                                            {loadingRemoveLists ? (
                                                <p>Loading...</p>
                                            ) : (
                                                movieInLists.length > 0 ? (
                                                    movieInLists.map((list) => (
                                                        <div
                                                            key={list.id}
                                                            className="movie-details-list-option"
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
                    </div>

                    <div className="info-container">
                        <h2>{movie.title}</h2>
                        <p>
                            <strong>Genres:</strong>{" "}
                            {movie.genres.map((g) => g.name).join(", ")}
                        </p>
                        <p>
                            <strong>Released:</strong>{" "}
                            {new Date(movie.released).toLocaleDateString("sk-SK")}
                        </p>
                        <p>
                            <strong>Director:</strong> {movie.director}
                        </p>
                        <p>
                            <strong>Plot:</strong> {movie.plot}
                        </p>
                    </div>
                </div>

                <div className="buttons">
                    <button onClick={() => navigate(-1)} className="movie-details-button">
                        Back
                    </button>
                    {isAdmin && (
                        <>
                            <Link
                                to={`/edit-movie/${id}/`}
                                className="edit-button movie-details-button"
                            >
                                <FontAwesomeIcon icon={faPencil} style={{marginRight: "8px"}}/>
                                Edit Movie
                            </Link>
                            <button
                                onClick={deleteMovie}
                                className="delete-button movie-details-button"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} style={{marginRight: "8px"}}/>
                                Delete Movie
                            </button>
                        </>
                    )}
                </div>

                <div className="details-split-container">
                    {/* Comments Section */}
                    <div className="comments-section">
                        <h3>Comments</h3>
                        {user && (
                            <div className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-input"
                />
                                <button className="submit-comment-button" onClick={postComment}>
                                    Post Comment
                                </button>
                            </div>
                        )}
                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <p>No comments yet. Be the first to comment!</p>
                            ) : (
                                comments.map((comment) => (
                                    <CommentComponent
                                        key={comment.id}
                                        comment={comment}
                                        onDelete={handleDeleteComment}
                                        movie_id={movie.id}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h3>Reviews</h3>
                        <p className="average-rating-text">
                            <strong>Average Rating:</strong> {averageRating.toFixed(1)} / 5
                        </p>

                        {user && !userHasReviewed && (
                            <div className="review-form-container">
                                <label>Rating (1–5):</label>
                                <input
                                    className="review-rating-input"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={newReviewRating}
                                    onChange={(e) => setNewReviewRating(e.target.value)}
                                />
                                <textarea
                                    className="review-textarea"
                                    value={newReviewText}
                                    onChange={(e) => setNewReviewText(e.target.value)}
                                    placeholder="Write your review..."
                                />
                                <button className="review-submit-button" onClick={postReview}>
                                    Submit Review
                                </button>
                            </div>
                        )}

                        {reviews.length === 0 ? (
                            <p>No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map((review) => (
                                <ReviewComponent
                                    key={review.id}
                                    review={review}
                                    handleDelete={fetchReviews}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;
