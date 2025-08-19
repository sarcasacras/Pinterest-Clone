import "./ProfilePage.css";
import Img from "../../components/Image/Image";
import Gallery from "../../components/Gallery/Gallery";
import Collections from "../../components/Collections/Collections";
import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../../api/usersApi";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("created");
  const { username } = useParams();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => usersApi.getUserByUsername(username),
    enabled: !!username,
  });

  if (isLoading) {
    return <div>Loading user profile</div>;
  }

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <Img
            src={user.avatar || "/general/noavatar.svg"}
            alt="Profile Avatar"
            className="avatar-image"
            w={100}
          />
        </div>
        <h1 className="profile-name">{user.displayName}</h1>
        <p className="profile-handle">@{user.username}</p>
        <div className="profile-stats">
          <span>{user.followers?.length || 0} followers</span>
          <span>•</span>
          <span>{user.following?.length || 0} following</span>
        </div>
        <div className="profile-buttons">
          <Img
            src="/icons/share.svg"
            alt="Share"
            className="btn-share"
            w={24}
          />
          <button className="btn-message">Message</button>
          <button className="btn-follow">Follow</button>
          <Img src="/icons/more.svg" alt="More" className="btn-more" w={24} />
        </div>
      </div>

      <div className="profile-nav">
        <button
          className={`nav-tab ${activeSection === "created" ? "active" : ""}`}
          onClick={() => setActiveSection("created")}
        >
          Created
        </button>
        <button
          className={`nav-tab ${activeSection === "saved" ? "active" : ""}`}
          onClick={() => setActiveSection("saved")}
        >
          Saved
        </button>
      </div>

      <div className="profile-content">
        {activeSection === "created" && (
          <div className="created-section">
            <Gallery variant={"profilePage"} userId={user._id} />
          </div>
        )}

        {activeSection === "saved" && (
          <div className="saved-section">
            <Collections userId={user._id} />
          </div>
        )}
      </div>
    </div>
  );
}
