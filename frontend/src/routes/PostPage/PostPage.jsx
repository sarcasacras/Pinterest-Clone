import "./PostPage.css";
import Img from "../../components/Image/Image";
import { Link } from "react-router";
import PostInteractions from "../../components/PostInteractions/PostInteractions";


export default function PostPage() {
  return (
    <div className="post-page">
      <div className="post-container">
        <div className="left">
          <Img src={"/pins/pin4.jpg"} className="pin-image" w={376} />
        </div>
        <div className="right">
          <div className="interactions">
            <PostInteractions />
          </div>
          <div className="user-section">
            <Link to="/john" className="user-profile">
              <Img src="/general/no-avatar.svg" alt="User Avatar" className="user-avatar" />
              <span className="username">John Doe</span>
            </Link>
          </div>
          <div className="comments-section">
            <h3>Comments</h3>
          </div>
          {/* <Comments /> */}
        </div>
      </div>
    </div>
  );
}
