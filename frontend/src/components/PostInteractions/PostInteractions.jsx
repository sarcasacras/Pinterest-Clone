import "./PostInteractions.css";
import Img from "../Image/Image";
import { useState } from "react";

export default function PostInteractions({ pin, onDeletePin, isOwner, isDeleting }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMoreClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="postInteractions">
      <div className="interactionButtons">
        <Img src="/icons/like.svg" alt="Like" className="buttonIcon" />
        <span>{pin?.likes?.length || 0}</span>
        <Img
          src="/icons/share.svg"
          alt="Share"
          className="buttonIcon"
          id="shareButton"
        />
        <Img
          src="/icons/more.svg"
          alt="More"
          className="buttonIcon"
          id="moreButton"
          onClick={handleMoreClick}
        />
      </div>
      {isOpen && isOwner && (
        <div className="dropdown">
          <button onClick={onDeletePin} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Pin"}
          </button>
        </div>
      )}
      <div className="saveButtonDiv">
        <button className="savePost">Save</button>
      </div>
    </div>
  );
}
