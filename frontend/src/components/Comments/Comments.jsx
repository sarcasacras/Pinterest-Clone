import "./Comments.css";
import Img from "../Image/Image";
import EmojiPicker from 'emoji-picker-react';
import { useState, useRef, useEffect } from 'react';

export default function Comments() {
  const [comment, setComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    setComment(prevComment => prevComment + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="comments">
      <span className="comments-count">9 comments</span>

      <div className="comments-list">
        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Jane Smith</div>
            <div className="comment-content">
              This is such a beautiful pin! Love the colors and composition.
            </div>
            <div className="comment-timestamp">2 hours ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Mike Johnson</div>
            <div className="comment-content">
              Amazing work! Where did you take this photo?
            </div>
            <div className="comment-timestamp">1 day ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Sarah Wilson</div>
            <div className="comment-content">
              This reminds me of my trip to the mountains last summer. Great
              capture!
            </div>
            <div className="comment-timestamp">3 days ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Alex Chen</div>
            <div className="comment-content">
              The lighting in this photo is absolutely perfect!
            </div>
            <div className="comment-timestamp">1 week ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Emma Davis</div>
            <div className="comment-content">
              Could you share the camera settings you used for this shot?
            </div>
            <div className="comment-timestamp">2 weeks ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">David Brown</div>
            <div className="comment-content">
              This would look great in my living room! Is it available as a
              print?
            </div>
            <div className="comment-timestamp">3 weeks ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Lisa Martinez</div>
            <div className="comment-content">
              Absolutely stunning! The depth of field is incredible.
            </div>
            <div className="comment-timestamp">1 month ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Tom Anderson</div>
            <div className="comment-content">
              Great composition! What lens did you use for this?
            </div>
            <div className="comment-timestamp">1 month ago</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-left">
            <Img
              src="/general/noavatar.svg"
              alt="User Avatar"
              className="comment-avatar"
            />
          </div>
          <div className="comment-right">
            <div className="comment-nickname">Rachel Green</div>
            <div className="comment-content">
              Love the natural lighting in this shot!
            </div>
            <div className="comment-timestamp">2 months ago</div>
          </div>
        </div>
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
