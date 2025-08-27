import "./Comments.css";
import Img from "../Image/Image";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { commentsApi } from "../../api/commentsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";

export default function Comments({ pin }) {
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now - commentDate;

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months < 12) return `${months} months ago`;

    return `${years} years ago`;
  };

  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const user = useAuth().user;
  const navigate = useNavigate();
  const location = useLocation();


  const onEmojiClick = (emojiObject) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ pinId, content }) => {
      return commentsApi.createComment(pinId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pins", params.id]);
      setComment("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ commentId }) => {
      return commentsApi.deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pins"]);
    },
  });

  const params = useParams();

  const handleSubmit = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!comment.trim()) return;
    mutation.mutate({ pinId: params.id, content: comment });
  };

  const handleDelete = (commentId) => {
    deleteMutation.mutate({commentId});
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && comment.trim() !== '') {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="comments">
      <span className="comments-count">
        {pin?.comments?.length || 0} Comments
      </span>

      <div className="comments-list">
        {pin?.comments && pin.comments.length > 0 ? (
          pin.comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <div className="comment-left">
                <Img
                  src={comment.author?.avatar || "/general/noavatar.svg"}
                  alt="User Avatar"
                  className="comment-avatar"
                />
              </div>
              <div className="comment-right">
                <div className="comment-nickname">
                  {comment.author?.displayName ||
                    comment.author?.username ||
                    "Unknown User"}
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-timestamp">
                  {formatTimeAgo(comment.createdAt)}
                </div>
                {comment.author?._id && user?._id && comment.author._id === user._id ? (
                  <button className="close-button">
                    <Img
                      src={"/icons/close.svg"}
                      w={80}
                      className={"close-button-image"}
                      onClick={() => handleDelete(comment._id)}
                    />
                  </button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-comments">
            <Img
              src="/icons/sad.svg"
              alt="No comments"
              className="empty-icon"
            />
            <p className="empty-text">No comments yet</p>
          </div>
        )}
      </div>

      <div className="comment-form" ref={emojiPickerRef}>
        <div className="comment-input-container">
          <input
            type="text"
            placeholder="Add a comment..."
            className="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (!user) {
                navigate('/login', { state: { from: location } });
              }
            }}
          />
          <div className="comment-right">
            <button
              type="button"
              className="emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>

            <Img
              src={"/icons/send.svg"}
              alt="Submit Button"
              className={"submit-button"}
              w={80}
              onClick={handleSubmit}
            />
          </div>
        </div>
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} className="emoji-picker" />
          </div>
        )}
      </div>
    </div>
  );
}
