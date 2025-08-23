import "./BoardPage.css";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { boardsApi } from "../../api/boardsApi";
import Gallery from "../../components/Gallery/Gallery";
import Img from "../../components/Image/Image";

export default function BoardPage() {
  const { boardId } = useParams();
  const {
    data: board,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardsApi.getBoardById(boardId),
    enabled: !!boardId,
  });

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
      <div>
        Error loading board:
        {error.message}
      </div>
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
              w={24}
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
      <Gallery variant="boardPage" staticPins={board.board.pins} />
    </div>
  );
}
