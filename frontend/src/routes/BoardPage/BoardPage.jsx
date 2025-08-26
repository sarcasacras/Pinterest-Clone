import "./BoardPage.css";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../../api/boardsApi";
import { pinsApi } from "../../api/pinsApi";
import { useAuth } from "../../contexts/AuthContext";
import Gallery from "../../components/Gallery/Gallery";
import Img from "../../components/Image/Image";
import CustomError from "../../components/CustomError/CustomError";

export default function BoardPage() {
  const { boardId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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
    if (window.confirm("Are you sure you want to remove this pin from the board?")) {
      removePinMutation.mutate({ pinId, boardId });
    }
  };

  const canRemoveFromBoard = user && board?.board && 
    (user._id === board.board.owner._id || user.isAdmin);

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
        </div>
      </div>
      <Gallery 
        variant="boardPage" 
        staticPins={board.board.pins} 
        boardId={boardId}
        onRemoveFromBoard={handleRemoveFromBoard}
        canRemoveFromBoard={canRemoveFromBoard}
      />
    </div>
  );
}
