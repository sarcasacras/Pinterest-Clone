import "./PostInteractions.css";
import Img from "../Image/Image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pinsApi } from "../../api/pinsApi";

export default function PostInteractions({ pin, onDeletePin, isOwner, isDeleting }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isLiked = user && pin && pin.likes?.includes(user._id);

  const likeMutation = useMutation({
    mutationFn: () => pinsApi.toggleLike(pin._id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["pin", pin._id] });
      await queryClient.cancelQueries({ queryKey: ["pins"] });
      
      const previousPinData = queryClient.getQueryData(["pin", pin._id]);
      
      if (previousPinData) {
        const updatedPin = { 
          ...previousPinData, 
          likes: isLiked 
            ? previousPinData.likes.filter(id => id !== user._id)
            : [...(previousPinData.likes || []), user._id]
        };
        queryClient.setQueryData(["pin", pin._id], updatedPin);
      }
      
      return { previousPinData };
    },
    onError: (err, variables, context) => {
      if (context?.previousPinData) {
        queryClient.setQueryData(["pin", pin._id], context.previousPinData);
      }
      console.error("Failed to toggle like:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pin", pin._id] });
      queryClient.invalidateQueries({ queryKey: ["pins"] });
    },
  });

  const handleMoreClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLikeClick = () => {
    if (user) {
      likeMutation.mutate();
    }
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
            className={`buttonIcon like-icon ${isLiked ? 'liked' : ''}`}
          />
          <span>{pin?.likes?.length || 0}</span>
        </div>
        <Img
          src="/icons/share.svg"
          alt="Share"
          className="buttonIcon"
          id="shareButton"
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
        <button className="savePost">Save</button>
      </div>
    </div>
  );
}
