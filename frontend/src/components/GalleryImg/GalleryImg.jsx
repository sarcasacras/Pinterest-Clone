import "../GalleryImg/GalleryImg.css";
import { Link } from "react-router";
import Img from "../Image/Image";

export default function GalleryImg({ item }) {
  const aspectRatio = item.height && item.width ? item.height / item.width : 1.5;
  const cardWidth = 360;
  const calculatedHeight = cardWidth * aspectRatio;
  const clampedHeight = Math.min(Math.max(calculatedHeight, 200), 800);
  const gridSpan = Math.ceil(clampedHeight / 100);
  return (
    <div className="galleryItem" style={{ gridRowEnd: `span ${gridSpan}` }}>
      <Img src={item.link} alt="placeholder" className="galleryImg" w={360} />
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
  );
}
