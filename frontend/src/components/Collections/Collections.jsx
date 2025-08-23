import "./Collections.css";
import CollectionItem from "../CollectionItem/CollectionItem";
import Img from "../Image/Image";
import { useQuery } from "@tanstack/react-query";
import { boardsApi } from "../../api/boardsApi";

export default function Collections({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["boards", userId],
    queryFn: () => boardsApi.getBoardsByUser(userId),
    enabled: !!userId,
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
    return <div>Loading boards...</div>;
  }

  if (error) {
    return <div>Error loading boards: {error.message}</div>;
  }

  const boards = data?.boards || [];

  return (
    <div className="collections">
      <div className="collections-grid">
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
            />
          ))
        ) : (
          <div className="empty-boards">
            <Img src="/icons/sad.svg" alt="No boards" className="empty-icon" />
            <p className="empty-text">User has no boards saved!</p>
          </div>
        )}
      </div>
    </div>
  );
}
