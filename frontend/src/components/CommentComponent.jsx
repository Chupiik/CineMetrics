import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTrash, faReply, faPlus, faMinus, faBan } from "@fortawesome/free-solid-svg-icons";
import "../styles/CommentComponent.css";

function CommentComponent({ comment, onDelete, movie_id }) {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [commentHeight, setCommentHeight] = useState(0);

  const [errorMessages, setErrorMessages] = useState({});

  // Fetch replies when the component mounts.
  useEffect(() => {
    getReplies();
  }, []);

  const handleEdit = () => {
    const commentElement = document.getElementById(`comment-${comment.id}`);
    if (commentElement) {
      setCommentHeight(commentElement.clientHeight);
    }
    setErrorMessages((prev) => ({ ...prev, edit: "" }));
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedContent.trim()) {
      setErrorMessages((prev) => ({ ...prev, edit: "Comment cannot be empty." }));
      return;
    }
    setErrorMessages((prev) => ({ ...prev, edit: "" }));

    api
      .put(`/api/comments/${comment.id}/edit/`, { content: editedContent })
      .then(() => {
        comment.content = editedContent;
        setIsEditing(false);
      })
      .catch(() => alert("Error updating comment"));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      api
        .delete(`/api/comments/${comment.id}/delete/`)
        .then(() => onDelete(comment.id))
        .catch(() => alert("Error deleting comment"));
    }
  };

  const cancelEditComment = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
    setErrorMessages((prev) => ({ ...prev, edit: "" }));
  };

  const handleReplyDelete = (replyId) => {
    setReplies((prevReplies) => prevReplies.filter((c) => c.id !== replyId));
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      setErrorMessages((prev) => ({ ...prev, reply: "Reply cannot be empty." }));
      return;
    }
    setErrorMessages((prev) => ({ ...prev, reply: "" }));

    api
      .post("/api/comments/add/", { parent: comment.id, content: replyContent, movie: movie_id })
      .then(() => {
        setReplyContent("");
        setShowReplyForm(false);
        getReplies();
      })
      .catch(() => alert("Error posting reply"));
  };

  const getReplies = () => {
    api
      .get(`/api/comments/${comment.id}/replies/`)
      .then((response) => {
        comment.replies = response.data;
        setReplies(response.data);
      })
      .catch(() => alert("Error fetching replies"));
  };

  const toggleReplies = () => {
    if (!showReplies) {
      getReplies();
      setShowReplies(true);
    } else {
      setShowReplies(false);
    }
  };

  return (
    <div id={`comment-${comment.id}`} className="comment-container">
      <div className="comment-header">
        <strong>{comment.user}</strong>{" "}
        <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
      </div>

      {isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => {
              setEditedContent(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="comment-edit-textarea"
            style={{ minHeight: "40px", height: `${commentHeight}px` }}
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }
            }}
          />
          {errorMessages.edit && <p className="error-message">{errorMessages.edit}</p>}
        </>
      ) : (
        <p className="comment-text">{comment.content}</p>
      )}

      <div className="comment-actions">
        {replies.length > 0 && (
          <button className="toggle-comment-replies-button" onClick={toggleReplies}>
            <FontAwesomeIcon icon={showReplies ? faMinus : faPlus} />
          </button>
        )}

        {user?.username === comment.user && (
          <>
            {isEditing ? (
              <>
                <button className="save-comment-button" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
                <button className="cancel-review-edit-button" onClick={cancelEditComment}>
                  <FontAwesomeIcon icon={faBan} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button className="edit-comment-button" onClick={handleEdit}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button className="delete-comment-button" onClick={handleDelete}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </>
            )}
          </>
        )}

        {user && (
          <button className="reply-comment-button" onClick={() => {
            setErrorMessages((prev) => ({ ...prev, reply: "" }));
            setShowReplyForm(!showReplyForm);
          }}>
            <FontAwesomeIcon icon={faReply} /> Reply
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="comment-edit-textarea"
          />
          {errorMessages.reply && <p className="error-message">{errorMessages.reply}</p>}
          <button className="submit-comment-reply-button" onClick={handleReply}>
            Post Reply
          </button>
        </div>
      )}

      {showReplies && replies.length > 0 && (
        <div className="replies">
          {replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              onDelete={handleReplyDelete}
              movie_id={movie_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentComponent;
