import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext.jsx";
import CommentComponent from "./CommentComponent";
import "../styles/ReviewComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faEdit,
  faTrash,
  faReply,
  faSave,
  faBan
} from "@fortawesome/free-solid-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import '../styles/colors.css'


function ReviewComponent({ review, handleDelete, handleEdit }) {
  const [comments, setComments] = useState([]);
  const { user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReviewText, setEditedReviewText] = useState(review.text);
  const [editedReviewRating, setEditedReviewRating] = useState(review.rating);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [errorMessages, setErrorMessages] = useState({ edit: "", reply: "" });

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
    setErrorMessages((prev) => ({ ...prev, edit: "" }));
    setIsEditing(true);
  };

  const cancelEditReview = () => {
    setIsEditing(false);
    setEditedReviewText(review.text);
    setEditedReviewRating(review.rating);
    setErrorMessages((prev) => ({ ...prev, edit: "" }));
  };

  const saveEditedReview = () => {
    api
      .put(`/api/reviews/${review.id}/edit/`, { text: editedReviewText, rating: editedReviewRating })
      .then(() => {
        setIsEditing(false);
        review.text = editedReviewText;
        review.rating = editedReviewRating;
        handleEdit();
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
    if (!replyContent || !replyContent.trim()) {
      setErrorMessages((prev) => ({ ...prev, reply: "Reply text cannot be empty." }));
      return;
    } else {
      setErrorMessages((prev) => ({ ...prev, reply: "" }));
    }

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
        fetchReviewComments();
      })
      .catch(() => alert("Failed to post reply"));
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <span className="review-user">{review.user}</span>
        {/* When not editing, display the rating as stars */}
        {!isEditing && (
          <span className="review-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={review.rating >= star ? solidStar : regularStar}
                style={{ color: "#FFD700", marginRight: "4px" }}
              />
            ))}
          </span>
        )}
      </div>

      <div className="review-content">
        {isEditing ? (
          <>
            <div className="review-edit-rating">
              <label>Rating: </label>
              <span className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={editedReviewRating >= star ? solidStar : regularStar}
                    onClick={() => setEditedReviewRating(star)}
                    style={{ cursor: "pointer", color: "#FF7D00", marginRight: "4px" }}
                  />
                ))}
              </span>
            </div>
            <textarea
              className="review-edit-textarea"
              value={editedReviewText}
              onChange={(e) => setEditedReviewText(e.target.value)}
            />
            {errorMessages.edit && (
              <p className="error-message">{errorMessages.edit}</p>
            )}
          </>
        ) : (
          <>
            <p className="review-text">{review.text}</p>
          </>
        )}
      </div>

      <div className="review-actions">
        <div className="review-buttons">
          {comments.length > 0 && (
            <button className="toggle-review-comment-button" onClick={toggleComments}>
              <FontAwesomeIcon icon={showComments ? faMinus : faPlus} />
            </button>
          )}
          {user && (
            <>
              {user.username === review.user && !isEditing ? (
                <>
                  <button className="edit-review-button" onClick={handleEditReview}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button className="delete-review-button" onClick={deleteReview}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </>
              ) : null}
              {isEditing && (
                <>
                  <button className="save-review-edit-button" onClick={saveEditedReview}>
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                  <button className="cancel-review-edit-button" onClick={cancelEditReview}>
                    <FontAwesomeIcon icon={faBan} /> Cancel
                  </button>
                </>
              )}
            </>
          )}
          <button
            className="reply-to-review-button"
            onClick={() => {
              setErrorMessages((prev) => ({ ...prev, reply: "" }));
              setShowReplyForm(!showReplyForm);
            }}
          >
            <FontAwesomeIcon icon={faReply} /> Reply
          </button>
        </div>
      </div>

      {showReplyForm && (
        <div className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="comment-edit-textarea"
          />
          {errorMessages.reply && (
            <p className="error-message">{errorMessages.reply}</p>
          )}
          <button className="submit-review-reply-button" onClick={postReviewReply}>
            Post Reply
          </button>
        </div>
      )}

      {showComments && comments.length > 0 && (
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
      )}
    </div>
  );
}

export default ReviewComponent;
