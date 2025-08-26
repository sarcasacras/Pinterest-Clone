import "./PostInteractions.css";
import Img from "../Image/Image";
import BoardSelector from "../BoardSelector/BoardSelector";
import ShareModal from "../ShareModal/ShareModal";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pinsApi } from "../../api/pinsApi";

export default function PostInteractions({ pin, onDeletePin, isOwner, isDeleting }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
    }
  };

  const handleSaveClick = () => {
    if (user) {
      setIsBoardSelectorOpen(true);
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
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
    </div>
  );
}
