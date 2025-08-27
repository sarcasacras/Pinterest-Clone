import "./PostInteractions.css";
import Img from "../Image/Image";
import BoardSelector from "../BoardSelector/BoardSelector";
import ShareModal from "../ShareModal/ShareModal";
import ImageEditor from "../ImageEditor/ImageEditor";
import CustomError from "../CustomError/CustomError";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router";
import { pinsApi } from "../../api/pinsApi";

export default function PostInteractions({ pin, onDeletePin, isOwner, isDeleting }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageUpdateError, setImageUpdateError] = useState(null);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const isLiked = user && pin && pin.likes?.includes(user._id);
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(pin?.likes?.length || 0);

  useEffect(() => {
    if (pin) {
      setOptimisticLiked(isLiked);
      setOptimisticCount(pin.likes?.length || 0);
    }
  }, [pin?._id]);

  const likeMutation = useMutation({
    mutationFn: () => pinsApi.toggleLike(pin._id),
    onSuccess: (data) => {
      if (data?.pin) {
        queryClient.setQueryData(["pin", pin._id], data.pin);
      }
      queryClient.invalidateQueries({ queryKey: ["pins"] });
    },
    onError: (err) => {
      setOptimisticLiked(!optimisticLiked);
      setOptimisticCount(optimisticLiked ? optimisticCount + 1 : optimisticCount - 1);
    },
  });

  const handleMoreClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLikeClick = () => {
    if (user) {
      setOptimisticLiked(!optimisticLiked);
      setOptimisticCount(optimisticLiked ? optimisticCount - 1 : optimisticCount + 1);
      likeMutation.mutate();
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  const handleSaveClick = () => {
    if (user) {
      setIsBoardSelectorOpen(true);
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleEditImageClick = () => {
    setIsImageEditorOpen(true);
    setIsOpen(false);
  };

  const updateImageMutation = useMutation({
    mutationFn: (imageFile) => pinsApi.updatePinImage(pin._id, imageFile),
    onSuccess: (data) => {
      console.log("Update response:", data);
      if (data?.pin) {
        queryClient.setQueryData(["pin", pin._id], data.pin);
      }
      queryClient.invalidateQueries({ queryKey: ["pins"] });
      queryClient.invalidateQueries({ queryKey: ["pin", pin._id] });
      setIsImageEditorOpen(false);
    },
    onError: (err) => {
      console.error("Failed to update pin image:", err);
      setImageUpdateError(`Failed to update image: ${err.response?.data?.error || err.message}`);
    },
  });

  const handleImageSave = (editedFile) => {
    updateImageMutation.mutate(editedFile);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  return (
    <div className="postInteractions">
      <div className="interactionButtons">
        <div className="like-container" onClick={handleLikeClick}>
          <Img 
            src="/icons/like.svg" 
            alt="Like" 
            className={`buttonIcon like-icon ${optimisticLiked ? 'liked' : ''}`}
          />
          <span>{optimisticCount}</span>
        </div>
        <Img
          src="/icons/share.svg"
          alt="Share"
          className="buttonIcon"
          id="shareButton"
          onClick={handleShareClick}
        />
        <div className="moreButtonContainer" ref={dropdownRef}>
          <Img
            src="/icons/more.svg"
            alt="More"
            className="buttonIcon"
            id="moreButton"
            onClick={handleMoreClick}
          />
          {isOpen && isOwner && (
            <div className="dropdown">
              <button onClick={handleEditImageClick}>
                Edit Image
              </button>
              <button onClick={onDeletePin} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Pin"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="saveButtonDiv">
        <button className="savePost" onClick={handleSaveClick}>Save</button>
      </div>

      <BoardSelector
        isOpen={isBoardSelectorOpen}
        onClose={() => setIsBoardSelectorOpen(false)}
        mode="save"
        pinId={pin._id}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pinId={pin._id}
        pinSlug={pin.slug}
      />

      {isImageEditorOpen && (
        <ImageEditor
          close={() => setIsImageEditorOpen(false)}
          src={pin.imageUrl}
          onSave={handleImageSave}
        />
      )}

      {imageUpdateError && (
        <CustomError
          message={imageUpdateError}
          close={() => setImageUpdateError(null)}
        />
      )}
    </div>
  );
}
