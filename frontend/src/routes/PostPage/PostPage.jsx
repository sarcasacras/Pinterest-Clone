import "./PostPage.css";
import Img from "../../components/Image/Image";
import { Link } from "react-router";
import PostInteractions from "../../components/PostInteractions/PostInteractions";
import Comments from "../../components/Comments/Comments";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { pinsApi } from "../../api/pinsApi";

export default function PostPage() {
  const { id } = useParams();

  const {
    data: pin,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pin", id],
    queryFn: () => pinsApi.getPinById(id),
    enabled: !!id,
  });


  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Pin is Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Error: {error.message}
      </div>
    );
  }

  if (!pin) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Pin is not found!
      </div>
    );
  }

  return (
    <div className="post-page">
      <Link to="/">
        <Img src="/icons/back.svg" alt="Back" className="back-button" />
      </Link>
      <div className="post-container">
        <div className="left">
          <Img src={pin.imageUrl} className="pin-image" w={376} />
        </div>
        <div className="right">
          <div>
            <h1 className="pin-title">{pin.title || "Без названия"}</h1>
            {pin.description && <p className="pin-description">{pin.description}</p>}
          </div>
          <div className="interactions">
            <PostInteractions pin={pin}/>
          </div>
          <div className="user-section">
            <Link to="/john" className="user-profile">
              <Img
                src="/general/noavatar.svg"
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="username">
                {pin.owner.displayName || pin.owner.username || "Unknown User"}
              </span>
            </Link>
          </div>
          <div className="comments-section">
            <Comments pin={pin}/>
          </div>
        </div>
      </div>
    </div>
  );
}
