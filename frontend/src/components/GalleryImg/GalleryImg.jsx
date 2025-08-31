import "../GalleryImg/GalleryImg.css";
import { Link, useNavigate, useLocation } from "react-router";
import Img from "../Image/Image";
import BoardSelector from "../BoardSelector/BoardSelector";
import ImageEditor from "../ImageEditor/ImageEditor";
import CustomAlert from "../CustomAlert/CustomAlert";
import CustomError from "../CustomError/CustomError";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pinsApi } from "../../api/pinsApi";

export default function GalleryImg({
  item,
  boardId,
  onRemoveFromBoard,
  canRemoveFromBoard,
}) {
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [imageUpdateError, setImageUpdateError] = useState(null);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const aspectRatio =
    item.height && item.width ? item.height / item.width : 1.5;
  const cardWidth = 360;
  const calculatedHeight = cardWidth * aspectRatio;
  const clampedHeight = Math.min(Math.max(calculatedHeight, 200), 800);
  const gridSpan = Math.ceil(clampedHeight / 100);

  const isOwner = user && item && (user._id === item.owner?._id || user.isAdmin);

  const handleSaveClick = () => {
    if (user) {
      setIsBoardSelectorOpen(true);
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  const handleRemoveFromBoard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFromBoard && boardId) {
      onRemoveFromBoard(item.id, boardId);
    }
  };
  const itemSlug = item.slug || item.id;

  const handleDownload = async () => {
    const link = document.createElement("a");
    const response = await fetch(item.link);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = `${item.title || "image"}.jpg`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditImageClick = () => {
    setIsImageEditorOpen(true);
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
    setIsDropdownOpen(false);
  };

  const confirmDelete = () => {
    deletePinMutation.mutate(item._id || item.id);
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
  };

  const updateImageMutation = useMutation({
    mutationFn: (imageFile) => pinsApi.updatePinImage(item._id || item.id, imageFile),
    onSuccess: (data) => {
      if (data?.pin) {
        queryClient.setQueryData(["pin", item._id || item.id], data.pin);
      }
      queryClient.invalidateQueries({ queryKey: ["pins"] });
      queryClient.invalidateQueries({ queryKey: ["pin", item._id || item.id] });
      setIsImageEditorOpen(false);
    },
    onError: (err) => {
      setImageUpdateError(`Failed to update image: ${err.response?.data?.error || err.message}`);
    },
  });

  const deletePinMutation = useMutation({
    mutationFn: (pinId) => pinsApi.deletePin(pinId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pins"] });
      queryClient.invalidateQueries({ queryKey: ["pins", "user", user._id] });
      if (boardId && onRemoveFromBoard) {
        onRemoveFromBoard(item._id || item.id, boardId);
      }
    },
    onError: (error) => {
      setImageUpdateError(`Failed to delete pin: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleImageSave = (editedFile) => {
    updateImageMutation.mutate(editedFile);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="galleryItem" style={{ gridRowEnd: `span ${gridSpan}` }}>
      <Img
        src={item.link}
        alt="placeholder"
        className="galleryImg"
        w={360}
        originalWidth={item.width}
        originalHeight={item.height}
      />
      <Link to={`/pin/${itemSlug}`} className="overlay"></Link>

      {canRemoveFromBoard && (
        <button className="remove-pin-btn" onClick={handleRemoveFromBoard}>
          ×
        </button>
      )}

      <button className="saveButton" onClick={handleSaveClick}>
        Save
      </button>
      <div className="overlayButtons">
        {isOwner && (
          <div className="overlayButton menu-button-container" ref={dropdownRef}>
            <button className="overlayButton" onClick={handleMenuClick}>
              <Img src="icons/menu.svg" alt="" className="buttonImage" />
            </button>
            {isDropdownOpen && (
              <div className="dropdown">
                <button onClick={handleEditImageClick}>
                  Edit Image
                </button>
                <button onClick={handleDeleteClick} disabled={deletePinMutation.isPending}>
                  {deletePinMutation.isPending ? "Deleting..." : "Delete Pin"}
                </button>
              </div>
            )}
          </div>
        )}
        <button className="overlayButton" onClick={handleDownload}>
          <Img src="icons/download.svg" alt="" className="buttonImage" />
        </button>
      </div>

      {isBoardSelectorOpen && (
        <BoardSelector
          isOpen={isBoardSelectorOpen}
          onClose={() => setIsBoardSelectorOpen(false)}
          mode="save"
          pinId={item.id}
          user={user}
        />
      )}

      {isImageEditorOpen && (
        <ImageEditor
          close={() => setIsImageEditorOpen(false)}
          src={item.link}
          onSave={handleImageSave}
        />
      )}

      {showDeleteAlert && (
        <CustomAlert
          title="Delete Pin"
          message="Are you sure you want to delete this pin? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
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
