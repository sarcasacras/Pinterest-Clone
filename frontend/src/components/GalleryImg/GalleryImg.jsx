import "../GalleryImg/GalleryImg.css";
import { Link } from "react-router";

export default function GalleryImg({ item }) {
  return (
    <div
      className="galleryItem"
      style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}
    >
      <img src={item.link} alt="" className="galleryImg" />
      <Link to={`/pins/${item.id}`} className="overlay"></Link>
      <button className="saveButton">Save</button>
      <div className="overlayButtons">
        <button className="overlayButton">
          <img src="icons/menu.svg" alt="" className="buttonImage"/>
        </button>
        <button className="overlayButton">
          <img src="icons/download.svg" alt="" className="buttonImage" />
        </button>
      </div>
    </div>
  );
}
