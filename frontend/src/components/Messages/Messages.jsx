import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { messagesApi } from "../../api/messagesApi";
import Img from "../Image/Image";
import Loader from "../Loader/Loader";
import "./Messages.css";

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const commentDate = new Date(dateString);
  const diffInMs = now - commentDate;
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hrs`;
  if (days < 7) return `${days} d`;
  return new Date(dateString).toLocaleDateString();
};

const Messages = ({ conversations, isLoading, error }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId) =>
      messagesApi.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleDeleteConversation = (conversationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );
    if (confirmed) {
      deleteConversationMutation.mutate(conversationId);
    }
  };

  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="messages-container">
      <h1 className="messages-title">Messages</h1>
      {isLoading && <Loader text="Loading conversations..." />}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (
        <div className="conversations-list">
          {conversations?.conversations?.length > 0 ? (
            conversations.conversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (participant) => participant._id !== user?._id
              );

              return (
                <div
                  key={conversation._id}
                  className="conversation-item"
                  onClick={() => handleConversationClick(conversation._id)}
                >
                  <Img
                    src={otherParticipant?.avatar || "/general/noavatar.svg"}
                    alt={otherParticipant?.displayName}
                    className="conversation-avatar"
                  />
                  <div className="conversation-content">
                    <p className="conversation-name">
                      {otherParticipant?.displayName || "Unknown"}
                    </p>
                    <p className="conversation-preview">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                    <p className="conversation-time">
                      {formatTimeAgo(conversation.lastActivity)}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="unread-indicator"></div>
                    )}
                    <Img
                      src="/icons/close.svg"
                      alt="Delete"
                      className="delete-conversation"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation._id);
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-conversations">
              <Img
                src="/icons/sad.svg"
                alt="No conversations"
                className="empty-icon"
              />
              <p className="empty-text">No conversations yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
