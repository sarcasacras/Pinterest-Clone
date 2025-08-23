import "./Collections.css";
import CollectionItem from "../CollectionItem/CollectionItem";
import Img from "../Image/Image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../../api/boardsApi";

export default function Collections({ userId, selectionMode = false, selectedBoard, onBoardSelect, variant = "default", currentUser }) {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["boards", userId],
    queryFn: () => boardsApi.getBoardsByUser(userId),
    enabled: !!userId,
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (boardId) => boardsApi.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", userId] });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      alert(`Failed to delete board: ${error.response?.data?.error || error.message}`);
    },
  });

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now - commentDate;

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours} hrs`;
    if (days < 7) return `${days} d`;
    if (weeks < 4) return `${weeks} w`;
    if (months < 12) return `${months} mo`;

    return `${years}y`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading boards...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error loading boards: {error.message}</div>;
  }

  const boards = data?.boards || [];

  const handleDeleteBoard = (boardId, boardName) => {
    if (window.confirm(`Are you sure you want to delete "${boardName}"? This action cannot be undone.`)) {
      deleteBoardMutation.mutate(boardId);
    }
  };

  return (
    <div className="collections">
      <div className={`collections-grid ${variant === "modal" ? "collections-grid-modal" : ""}`}>
        {boards.length > 0 ? (
          boards.map((board) => (
            <CollectionItem
              key={board._id}
              boardId={board._id}
              src={board.effectiveCoverImage || "/pins/pin1.jpg"}
              pinCount={board.pins?.length || 0}
              timeAgo={formatTimeAgo(board.updatedAt)}
              alt={board.title}
              name={board.title}
              selectionMode={selectionMode}
              isSelected={selectedBoard?._id === board._id}
              onSelect={selectionMode ? () => onBoardSelect(board) : undefined}
              variant={variant}
              canDelete={currentUser && (currentUser._id === board.owner || currentUser.isAdmin)}
              onDelete={handleDeleteBoard}
            />
          ))
        ) : (
          <div className="empty-boards">
            <Img src="/icons/sad.svg" alt="No boards" className="empty-icon" />
            <p className="empty-text">There are no boards here</p>
          </div>
        )}
      </div>
    </div>
  );
}
