import "../GalleryImg/GalleryImg.css";
import { Link } from "react-router";
import Img from "../Image/Image";
import BoardSelector from "../BoardSelector/BoardSelector";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function GalleryImg({ item, variant, boardId, onRemoveFromBoard, canRemoveFromBoard }) {
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false);
  const { user } = useAuth();
  
  const aspectRatio = item.height && item.width ? item.height / item.width : 1.5;
  const cardWidth = 360;
  const calculatedHeight = cardWidth * aspectRatio;
  const clampedHeight = Math.min(Math.max(calculatedHeight, 200), 800);
  const gridSpan = Math.ceil(clampedHeight / 100);

  const handleSaveClick = () => {
    if (user) {
      setIsBoardSelectorOpen(true);
    }
  };

  const handleRemoveFromBoard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFromBoard && boardId) {
      onRemoveFromBoard(item.id, boardId);
    }
  };
  return (
    <div className="galleryItem" style={{ gridRowEnd: `span ${gridSpan}` }}>
      <Img src={item.link} alt="placeholder" className="galleryImg" w={360} />
      <Link to={`/pin/${item.id}`} className="overlay"></Link>
      
      {canRemoveFromBoard && (
        <button className="remove-pin-btn" onClick={handleRemoveFromBoard}>
          ×
        </button>
      )}
      
      <button className="saveButton" onClick={handleSaveClick}>Save</button>
      <div className="overlayButtons">
        <button className="overlayButton">
          <Img src="icons/menu.svg" alt="" className="buttonImage" />
        </button>
        <button className="overlayButton">
          <Img src="icons/download.svg" alt="" className="buttonImage" />
        </button>
      </div>

      <BoardSelector
        isOpen={isBoardSelectorOpen}
        onClose={() => setIsBoardSelectorOpen(false)}
        mode="save"
        pinId={item.id}
      />
    </div>
  );
}
