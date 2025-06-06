import "../GalleryImg/GalleryImg.css"

export default function GalleryImg({ item }) {
  return (
    <div className="galleryItem" style={{gridRowEnd: `span ${Math.ceil(item.height/100)}`}}>
      <img src={item.link} alt="" className="galleryImg"/>
    </div>
  );
}
