import "../GalleryImg/GalleryImg.css";
import { Link } from "react-router";
import Img from "../Image/Image";

export default function GalleryImg({ item }) {
  const baseHeight = item.height || 600;
  const scaledHeight = Math.min(baseHeight, 800); 
  const gridSpan = Math.ceil(scaledHeight / 100);
  
  return (
    <div
      className="galleryItem"
      style={{ gridRowEnd: `span ${gridSpan}` }}
    >
      <Img
        src={item.link}
        alt="placeholder"
        className="galleryImg"
        w={360}
      />
      <Link to={`/pin/${item.id}`} className="overlay"></Link>
      <button className="saveButton">Save</button>
      <div className="overlayButtons">
        <button className="overlayButton">
          <Img src="icons/menu.svg" alt="" className="buttonImage" />
        </button>
        <button className="overlayButton">
          <Img src="icons/download.svg" alt="" className="buttonImage" />
        </button>
      </div>
    </div>
  )
}
