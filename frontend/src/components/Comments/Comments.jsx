import "./Comments.css";
import Img from "../Image/Image";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";

export default function Comments({ pin }) {

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now - commentDate;

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks} weeks ago`;

    return commentDate.toLocaleDateString('en-EN');
  }

  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

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
                <div className="comment-timestamp">{formatTimeAgo(comment.createdAt)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">No comments yet</div>
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
          />
          <button
            type="button"
            className="emoji-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
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
