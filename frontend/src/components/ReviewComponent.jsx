import React, {useState, useEffect, useContext} from "react";
import api from "../api";
import {AuthContext} from "../context/AuthContext.jsx";
import CommentComponent from "./CommentComponent";
import "../styles/ReviewComponent.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faEdit, faTrash, faReply, faSave, faBan} from "@fortawesome/free-solid-svg-icons";

function ReviewComponent({review, handleDelete}) {
    const [comments, setComments] = useState([]);
    const {user} = useContext(AuthContext);
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedReviewText, setEditedReviewText] = useState(review.text);
    const [replyContent, setReplyContent] = useState("");
    const [showReplyForm, setShowReplyForm] = useState(false);

    useEffect(() => {
        fetchReviewComments();
    }, [review.id]);

    const fetchReviewComments = () => {
        api
            .get(`/api/reviews/${review.id}/comments/`)
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => console.error("Failed to fetch review comments", err));
    };

    const handleDeleteComment = (commentId) => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    const toggleComments = () => {
        setShowComments(!showComments);
        if (!showComments) {
            fetchReviewComments();
        }
    };

    const handleEditReview = () => {
        setIsEditing(true);
    };

    const cancelEditReview = () => {
        setIsEditing(false);
        setEditedReviewText(review.text);
    };

    const saveEditedReview = () => {
        api
            .put(`/api/reviews/${review.id}/edit/`, {text: editedReviewText})
            .then(() => {
                setIsEditing(false);
                review.text = editedReviewText;
            })
            .catch(() => alert("Failed to update review"));
    };

    const deleteReview = () => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            api
                .delete(`/api/reviews/${review.id}/delete/`)
                .then(() => {
                    handleDelete();
                })
                .catch(() => alert("Failed to delete review"));
        }
    };

    const postReviewReply = () => {
        if (!replyContent.trim()) return;

        const data = {
            parent: null,
            content: replyContent,
            review: review.id,
        };

        api
            .post("/api/comments/add/", data)
            .then(() => {
                setReplyContent("");
                setShowReplyForm(false);
                fetchReviewComments(); // Refresh comments after replying
            })
            .catch(() => alert("Failed to post reply"));
    };

    return (
        <div className="review-container">
            <div className="review-header">
                <span className="review-user">{review.user}</span>
                <span className="review-rating">{review.rating} / 5</span>
            </div>

            <div className="review-content">
                {isEditing ? (
                    <textarea
                        className="review-edit-textarea"
                        value={editedReviewText}
                        onChange={(e) => setEditedReviewText(e.target.value)}
                    />
                ) : (
                    <p className="review-text">{review.text}</p>
                )}
            </div>

            <div className="review-actions">


                <div className="review-buttons">
                    {comments.length > 0 && (
                        <button className="toggle-review-comment-button" onClick={toggleComments}>
                            <FontAwesomeIcon icon={showComments ? faMinus : faPlus}/>
                        </button>
                    )}
                    {user && (
                        <>
                            <>
                                {user.username === review.user && !isEditing && (
                                    <>
                                        <button className="edit-review-button" onClick={handleEditReview}>
                                            <FontAwesomeIcon icon={faEdit}/> Edit
                                        </button>
                                        <button className="delete-review-button" onClick={deleteReview}>
                                            <FontAwesomeIcon icon={faTrash}/> Delete
                                        </button>
                                    </>
                                )}
                            </>
                            {isEditing && (
                                <>
                                    <button className="save-review-edit-button" onClick={saveEditedReview}>
                                        <FontAwesomeIcon icon={faSave}/> Save
                                    </button>
                                    <button className="cancel-review-edit-button" onClick={cancelEditReview}>
                                        <FontAwesomeIcon icon={faBan}/> Cancel
                                    </button>
                                </>
                            )}
                        </>
                    )}


                    <button className="reply-to-review-button" onClick={() => setShowReplyForm(!showReplyForm)}>
                        <FontAwesomeIcon icon={faReply}/> Reply
                    </button>

                </div>
            </div>

            {
                showReplyForm && (
                    <div className="reply-form">
          <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="comment-edit-textarea"
          />
                        <button className="submit-review-reply-button" onClick={postReviewReply}>
                            Post Reply
                        </button>
                    </div>
                )
            }

            {
                showComments && comments.length > 0 && (
                    <div className="review-comments-list">
                        {comments.map((comment) => (
                            <div className="review-single-comment" key={comment.id}>
                                <CommentComponent
                                    comment={comment}
                                    movie_id={review.movie}
                                    onDelete={handleDeleteComment}
                                />
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
        ;
}

export default ReviewComponent;
