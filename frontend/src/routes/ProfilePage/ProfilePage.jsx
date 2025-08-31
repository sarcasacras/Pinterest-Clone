import "./ProfilePage.css";
import Img from "../../components/Image/Image";
import Gallery from "../../components/Gallery/Gallery";
import Collections from "../../components/Collections/Collections";
import CustomError from "../../components/CustomError/CustomError";
import ShareModal from "../../components/ShareModal/ShareModal";
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../api/usersApi";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/authApi";
import { messagesApi } from "../../api/messagesApi";
import { resizeImage } from "../../utils/imageUtils";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("created");
  const { username } = useParams();
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedDisplayName, setEditedDisplayName] = useState("");
  const [profileUpdateError, setProfileUpdateError] = useState(null);
  const [avatarUpdateError, setAvatarUpdateError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
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
      setAvatarUpdateError(`Failed to update avatar: ${error.response?.data?.error || error.message}`);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => authApi.updateProfile(profileData),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["user", username] });
      queryClient.invalidateQueries({ queryKey: ["user", data.user.username] });
      setIsEditing(false);
      setProfileUpdateError(null);
      setValidationErrors({});
      
      if (data.user.username !== username) {
        navigate(`/${data.user.username}`, { replace: true });
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to update profile";
      
      if (errorMessage.includes('Username can only contain') || 
          errorMessage.includes('Username must be') || 
          errorMessage.includes('Username cannot exceed')) {
        setValidationErrors(prev => ({
          ...prev,
          username: errorMessage.replace('Validation failed: username: ', '')
        }));
      } else if (errorMessage.includes('Display name')) {
        setValidationErrors(prev => ({
          ...prev,
          displayName: errorMessage.replace('Validation failed: displayName: ', '')
        }));
      } else {
        setProfileUpdateError(errorMessage);
      }
    },
  });

  const startConversationMutation = useMutation({
    mutationFn: (recipientId) => messagesApi.startConversation(recipientId),
    onSuccess: () => {
      navigate('/messages');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      setUser(null);
      navigate('/');
    },
    onError: () => {
      setUser(null);
      navigate('/');
    },
  });

  const handleMessageUser = () => {
    if (user?._id) {
      startConversationMutation.mutate(user._id);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading user profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <CustomError
        message={`Error loading profile: ${error.message}`}
        close={() => (window.location.href = "/")}
      />
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const isOwnProfile = currentUser && user && (currentUser._id === user._id || currentUser.username === user.username);

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
    } catch {
      updateAvatarMutation.mutate(file);
    }
  };

  const handleShareProfile = () => {
    setIsShareModalOpen(true);
  };

  const handleMoreClick = () => {
    const isOwner = currentUser && user && 
      (currentUser._id === user._id || currentUser.username === user.username);
    
    if (isOwner) {
      setIsEditing(true);
      setEditedUsername(user.username || "");
      setEditedDisplayName(user.displayName || "");
    }
  };

  const validateUsername = (username) => {
    const trimmed = username.trim();
    if (!trimmed) return "Username is required";
    if (trimmed.length < 3) return "Username must be at least 3 characters long";
    if (trimmed.length > 20) return "Username cannot exceed 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return "Username can only contain letters, numbers, and underscores";
    return null;
  };

  const validateDisplayName = (displayName) => {
    const trimmed = displayName.trim();
    if (!trimmed) return "Display name is required";
    if (trimmed.length > 50) return "Display name cannot exceed 50 characters";
    return null;
  };

  const validateForm = () => {
    const errors = {};
    
    const usernameError = validateUsername(editedUsername);
    if (usernameError) errors.username = usernameError;
    
    const displayNameError = validateDisplayName(editedDisplayName);
    if (displayNameError) errors.displayName = displayNameError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setEditedUsername(value);
    
    const error = validateUsername(value);
    setValidationErrors(prev => ({
      ...prev,
      username: error
    }));
  };

  const handleDisplayNameChange = (e) => {
    const value = e.target.value;
    setEditedDisplayName(value);
    
    const error = validateDisplayName(value);
    setValidationErrors(prev => ({
      ...prev,
      displayName: error
    }));
  };

  const handleSaveChanges = () => {
    if (!validateForm()) {
      return;
    }

    updateProfileMutation.mutate({
      username: editedUsername.trim(),
      displayName: editedDisplayName.trim(),
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationErrors({});
    setProfileUpdateError(null);
    setEditedUsername(user.username || "");
    setEditedDisplayName(user.displayName || "");
  };


  return (
    <div className="profile-page">
      <div className={`profile-header ${isEditing ? "editing" : ""}`}>
        <div
          className={`profile-avatar ${isOwnProfile ? "editable" : ""}`}
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
              <Img
                src="/icons/camera.svg"
                alt="Change Avatar"
                className="camera-icon"
                w={24}
              />
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
          style={{ display: "none" }}
        />
        {isEditing ? (
          <div className="input-group">
            <input
              type="text"
              className={`profile-name-input ${validationErrors.displayName ? 'error' : ''}`}
              value={editedDisplayName}
              onChange={handleDisplayNameChange}
              placeholder="Display name"
            />
            <span className={`validation-error-slot ${validationErrors.displayName ? 'has-error' : ''}`}>
              {validationErrors.displayName || '\u00A0'}
            </span>
          </div>
        ) : (
          <h1 className="profile-name">{user.displayName}</h1>
        )}

        {isEditing ? (
          <div className="input-group">
            <input
              type="text"
              className={`profile-handle-input ${validationErrors.username ? 'error' : ''}`}
              value={editedUsername}
              onChange={handleUsernameChange}
              placeholder="username"
            />
            <span className={`validation-error-slot ${validationErrors.username ? 'has-error' : ''}`}>
              {validationErrors.username || '\u00A0'}
            </span>
          </div>
        ) : (
          <p className="profile-handle">@{user.username}</p>
        )}

        {!isEditing && (
          <div className="profile-buttons">
            {isOwnProfile && (
              <>
                <Img
                  src="/icons/share.svg"
                  alt="Share"
                  className="btn-share"
                  w={24}
                  onClick={handleShareProfile}
                />
                <button 
                  className="btn-logout" 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <Img 
                    src="/icons/log-out.svg" 
                    alt="Logout" 
                    w={20}
                  />
                  Logout
                </button>
                <Img
                  src="/icons/profile-edit.svg"
                  alt="More"
                  className="btn-more"
                  w={24}
                  onClick={handleMoreClick}
                />
              </>
            )}
            {!isOwnProfile && (
              <button className="btn-message" onClick={handleMessageUser}>Message</button>
            )}
          </div>
        )}

        {isEditing && (
          <div className="edit-controls">
            <button className="btn-cancel" onClick={handleCancelEdit}>
              <Img src="/icons/close.svg" alt="Cancel" w={20} />
            </button>
            <button 
              className="btn-confirm" 
              onClick={handleSaveChanges}
              disabled={Object.keys(validationErrors).some(key => validationErrors[key])}
            >
              <Img src="/icons/done.svg" alt="Save" w={20} />
            </button>
          </div>
        )}
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

      {profileUpdateError && (
        <CustomError 
          message={profileUpdateError} 
          close={() => setProfileUpdateError(null)} 
        />
      )}

      {avatarUpdateError && (
        <CustomError 
          message={avatarUpdateError} 
          close={() => setAvatarUpdateError(null)} 
        />
      )}
    </div>
  );
}
