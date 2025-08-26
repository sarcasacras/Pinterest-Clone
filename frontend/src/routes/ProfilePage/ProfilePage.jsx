import "./ProfilePage.css";
import Img from "../../components/Image/Image";
import Gallery from "../../components/Gallery/Gallery";
import Collections from "../../components/Collections/Collections";
import CustomError from "../../components/CustomError/CustomError";
import ShareModal from "../../components/ShareModal/ShareModal";
import { useState, useRef } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../api/usersApi";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/authApi";
import { resizeImage } from "../../utils/imageUtils";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("created");
  const { username } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const authData = useAuth();
  const { user: currentUser, setUser } = authData;
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => usersApi.getUserByUsername(username),
    enabled: !!username,
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (avatarFile) => authApi.updateAvatar(avatarFile),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
    onError: (error) => {
      alert("Failed to update avatar");
    },
  });
  

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading user profile...</p>
      </div>
    );
  }

  if (error) {
    return <CustomError message={`Error loading profile: ${error.message}`} close={() => window.location.href = '/'} />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const isOwnProfile = currentUser && user && currentUser._id === user._id;

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const resizedFile = await resizeImage(file, 400, 400, 0.9);
      updateAvatarMutation.mutate(resizedFile);
    } catch (error) {
      updateAvatarMutation.mutate(file);
    }
  };

  const handleShareProfile = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div 
          className={`profile-avatar ${isOwnProfile ? 'editable' : ''}`}
          onClick={handleAvatarClick}
        >
          <Img
            src={user.avatar || "/general/noavatar.svg"}
            alt="Profile Avatar"
            className="avatar-image"
            w={100}
          />
          {isOwnProfile && (
            <div className="avatar-overlay">
              <Img src="/icons/camera.svg" alt="Change Avatar" className="camera-icon" w={24} />
            </div>
          )}
          {updateAvatarMutation.isPending && (
            <div className="avatar-loading">Uploading...</div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
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
            onClick={handleShareProfile}
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
            <Collections userId={user._id} currentUser={currentUser} />
          </div>
        )}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profileUsername={user.username}
      />
    </div>
  );
}
