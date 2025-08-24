import "./CollectionItem.css";
import { Link } from "react-router";
import Img from "../Image/Image";

export default function CollectionItem({
  src,
  pinCount,
  timeAgo,
  alt,
  name,
  boardId,
  selectionMode = false,
  isSelected = false,
  onSelect,
  variant = "default",
  onDelete,
  canDelete = false,
}) {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${name || "image"}.jpg`;
    link.click()
  }

  return (
    <div
      className={`collection-item ${selectionMode ? "selection-mode" : ""} ${
        isSelected ? "selected" : ""
      } ${variant === "modal" ? "modal-variant" : ""}`}
      onClick={selectionMode ? onSelect : undefined}
    >
      <div className="collection-image-container">
        <Img src={src} alt={alt} w={300} className="collection-img" />

        {selectionMode ? (
          <div className="selection-overlay"></div>
        ) : (
          <>
            <Link to={`/board/${boardId}`} className="overlay"></Link>
            <button className="saveButton">Save</button>
            <div className="overlayButtons">
              <button className="overlayButton">
                <Img src="/icons/menu.svg" alt="" className="buttonImage" />
              </button>
              
            </div>
          </>
        )}

        {canDelete && (
          <button
            className="delete-board-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(boardId, name);
            }}
          >
            ×
          </button>
        )}
      </div>
      <div className="collection-info">
        <h3 className="collection-name">{name}</h3>
        {variant !== "modal" && (
          <span>
            {pinCount} pins{timeAgo ? ` • ${timeAgo}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
