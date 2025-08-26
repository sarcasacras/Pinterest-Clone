import "./BoardPage.css";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../../api/boardsApi";
import { pinsApi } from "../../api/pinsApi";
import { useAuth } from "../../contexts/AuthContext";
import Gallery from "../../components/Gallery/Gallery";
import Img from "../../components/Image/Image";
import CustomError from "../../components/CustomError/CustomError";
import ShareModal from "../../components/ShareModal/ShareModal";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { useState } from "react";

export default function BoardPage() {
  const { boardId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [removePinAlert, setRemovePinAlert] = useState(null);
  
  const {
    data: board,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardsApi.getBoardById(boardId),
    enabled: !!boardId,
  });

  const removePinMutation = useMutation({
    mutationFn: ({ pinId, boardId }) => pinsApi.removePinFromBoard(pinId, boardId),
    onSuccess: () => {
      queryClient.invalidateQueries(["board", boardId]);
      queryClient.invalidateQueries(["boards", user._id]);
    },
    onError: (error) => {
      alert(`Failed to remove pin: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleRemoveFromBoard = (pinId, boardId) => {
    setRemovePinAlert({ pinId, boardId });
  };

  const confirmRemovePin = () => {
    if (removePinAlert) {
      removePinMutation.mutate({ 
        pinId: removePinAlert.pinId, 
        boardId: removePinAlert.boardId 
      });
      setRemovePinAlert(null);
    }
  };

  const cancelRemovePin = () => {
    setRemovePinAlert(null);
  };

  const handleShareBoard = () => {
    setIsShareModalOpen(true);
  };

  const handleDeleteBoard = () => {
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    // TODO: Implement board deletion
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
  };

  const canRemoveFromBoard = user && board?.board && 
    (user._id === board.board.owner._id || user.isAdmin);

  const isOwner = user && board?.board && user._id === board.board.owner._id;

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <CustomError 
        message={`Error loading board: ${error.message}`} 
        close={() => window.location.href = '/'} 
      />
    );
  }

  if (!board?.board) {
    return <div>Board not found</div>;
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <div className="board-info">
          <Link to={`/${board.board.owner?.username || ''}`} className="board-owner">
            <Img 
              src={board.board.owner?.avatar || "/general/noavatar.svg"}
              alt="Owner avatar"
              className="owner-avatar"
              w={80}
              />
            <span className="owner-name">
              {board.board.owner?.displayName || board.board.owner?.username || "Unknown"}
            </span>
          </Link>
        </div>
        <div className="board-title-container">
          <h1 className="board-title">{board.board.title}</h1>
          {board.board.description && (
            <p className="board-description">{board.board.description}</p>
          )}
          <div className="board-buttons">
            {isOwner && (
              <Img 
                src="/icons/more.svg" 
                alt="More" 
                className="btn-more" 
                w={24}
                onClick={handleDeleteBoard}
              />
            )}
            <Img
              src="/icons/share.svg"
              alt="Share"
              className="btn-share"
              w={24}
              onClick={handleShareBoard}
            />
          </div>
        </div>
      </div>
      <Gallery 
        variant="boardPage" 
        staticPins={board.board.pins} 
        boardId={boardId}
        onRemoveFromBoard={handleRemoveFromBoard}
        canRemoveFromBoard={canRemoveFromBoard}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pinId={boardId}
        pinSlug={`board/${boardId}`}
      />

      {showDeleteAlert && (
        <CustomAlert
          title="Delete Board"
          message="Are you sure you want to delete this board? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {removePinAlert && (
        <CustomAlert
          title="Remove Pin"
          message="Are you sure you want to remove this pin from the board?"
          onConfirm={confirmRemovePin}
          onCancel={cancelRemovePin}
        />
      )}
    </div>
  );
}
