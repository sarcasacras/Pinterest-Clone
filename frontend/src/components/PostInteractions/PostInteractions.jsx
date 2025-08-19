import "./PostInteractions.css";
import Img from "../Image/Image";

export default function PostInteractions({ pin }) {
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
        />
      </div>
      <div className="saveButtonDiv">
        <button className="savePost">Save</button>
      </div>
    </div>
  );
}
