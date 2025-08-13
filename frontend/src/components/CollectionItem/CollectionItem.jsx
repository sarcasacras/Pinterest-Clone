import "./CollectionItem.css";
import { Link } from "react-router";
import Img from "../Image/Image";

export default function CollectionItem({ src, pinCount, timeAgo, alt, name }) {
  return (
    <div className="collection-item">
      <div className="collection-image-container">
        <Img src={src} alt={alt} w={300} className="collection-img" />
        <Link to={`/pin/1`} className="overlay"></Link>
        <button className="saveButton">Save</button>
        <div className="overlayButtons">
          <button className="overlayButton">
            <Img src="/icons/menu.svg" alt="" className="buttonImage" />
          </button>
          <button className="overlayButton">
            <Img src="/icons/download.svg" alt="" className="buttonImage" />
          </button>
        </div>
      </div>
      <div className="collection-info">
        <h3 className="collection-name">{name}</h3>
        <span>{pinCount} pins • {timeAgo}</span>
      </div>
    </div>
  );
}