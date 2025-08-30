import Img from "../Image/Image";
import "./UserIcon.css";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";

export default function UserIcon() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="user">
        <Link to={`/${user.username}`} className="avatar-link">
          <Img
            src={user.avatar || "/icons/user.svg"}
            alt=""
            className="userIcon"
            w={64}
          />
        </Link>
      </div>
    );
  } else {
    return null;
  }
}
