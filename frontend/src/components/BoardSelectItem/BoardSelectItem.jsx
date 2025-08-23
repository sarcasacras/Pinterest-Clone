import "./BoardSelectItem.css";
import Img from "../Image/Image";

export default function BoardSelectItem({ 
  src, 
  pinCount, 
  alt, 
  name, 
  boardId, 
  isSelected, 
  onClick 
}) {
  return (
    <div 
      className={`board-select-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick({ _id: boardId, title: name })}
    >
      <div className="board-select-image-container">
        <Img 
          src={src || "/placeholder-board.jpg"} 
          alt={alt} 
          w={200} 
          className="board-select-img" 
        />
        {isSelected && (
          <div className="selection-indicator">
            <span className="checkmark">✓</span>
          </div>
        )}
      </div>
      <div className="board-select-info">
        <h4 className="board-select-name">{name}</h4>
        <span className="board-select-count">{pinCount} pins</span>
      </div>
    </div>
  );
}