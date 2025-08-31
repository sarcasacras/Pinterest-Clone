import "./Chat.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "../../api/messagesApi";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import EmojiPicker from "emoji-picker-react";
import Img from "../Image/Image";
import CustomAlert from "../CustomAlert/CustomAlert";
import Loader from "../Loader/Loader";

const Chat = ({ conversationId, conversation }) => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [exitingEditMode, setExitingEditMode] = useState(null);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const otherParticipant = conversation?.participants?.find(
    (participant) => participant._id !== user?._id
  );

  const onEmojiClick = (emojiObject) => {
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the message items
      if (!event.target.closest('.own-message')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      // Add a small delay to avoid immediate closure
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 10);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => messagesApi.getConversationMessages(conversationId),
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content) => messagesApi.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages", conversationId],
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId) => messagesApi.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages", conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: ({ messageId, content }) => messagesApi.editMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages", conversationId],
      });
      setEditingMessage(null);
      setEditContent("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      messagesApi.markMessagesAsRead(conversationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
        queryClient.invalidateQueries({
          queryKey: ["unread-messages-count"],
        });
      });
    }
  }, [conversationId, queryClient, messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessageMutation.mutate(messageInput);
      setMessageInput("");
    }
  };

  const handleDeleteMessage = (messageId) => {
    setDeleteAlert({ messageId });
    setOpenDropdown(null);
  };

  const confirmDelete = () => {
    if (deleteAlert?.messageId) {
      deleteMessageMutation.mutate(deleteAlert.messageId);
    }
    setDeleteAlert(null);
  };

  const cancelDelete = () => {
    setDeleteAlert(null);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message._id);
    setEditContent(message.content);
    setOpenDropdown(null);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editingMessage) {
      setExitingEditMode(editingMessage);
      setTimeout(() => {
        editMessageMutation.mutate({
          messageId: editingMessage,
          content: editContent.trim(),
        });
        setExitingEditMode(null);
      }, 200);
    }
  };

  const handleCancelEdit = () => {
    setExitingEditMode(editingMessage);
    setTimeout(() => {
      setEditingMessage(null);
      setEditContent("");
      setExitingEditMode(null);
    }, 200);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-user-info">
          <Link to={`/${otherParticipant?.username || ''}`} className="chat-user-link">
            <div className="chat-avatar">
              <img
                src={otherParticipant?.avatar || "/general/noavatar.svg"}
                alt={otherParticipant?.displayName}
              />
            </div>
            <h2 className="chat-user-name">
              {otherParticipant?.displayName || "Unknown User"}
            </h2>
          </Link>
        </div>
      </div>
      {isLoading && <Loader text="Loading messages..." />}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (
        <div className="messages-list">
          {messages?.messages?.length > 0 ? (
            messages.messages.map((message, index) => {
              const isOwnMessage = message.sender._id === user?._id;
              const prevMessage = messages.messages[index - 1];
              const showSender =
                !prevMessage || prevMessage.sender._id !== message.sender._id;

              return (
                <div key={message._id}>
                  {showSender && (
                    <div
                      className={`message-sender ${
                        isOwnMessage ? "own-sender" : "other-sender"
                      }`}
                    >
                      <Link to={`/${message.sender.username || ''}`} className="message-sender-link">
                        {message.sender.displayName}
                      </Link>
                    </div>
                  )}
                  <div
                    className={`message-item ${
                      isOwnMessage ? "own-message" : "other-message"
                    } ${!showSender ? "grouped-message" : ""}`}
                    onClick={() => isOwnMessage && !editingMessage && setOpenDropdown(openDropdown === message._id ? null : message._id)}
                  >
                    {editingMessage === message._id ? (
                      <div className={`edit-message-container ${exitingEditMode === message._id ? 'exiting' : ''}`}>
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit();
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          className="edit-message-input"
                          autoFocus
                        />
                        <div className="edit-buttons">
                          <button 
                            className="save-edit-button"
                            onClick={handleSaveEdit}
                          >
                            Save
                          </button>
                          <button 
                            className="cancel-edit-button"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="message-content">
                        <p className="message-paragraph">{message.content}</p>
                      </div>
                    )}
                    {isOwnMessage && openDropdown === message._id && (
                      <div className="message-dropdown">
                        <button 
                          className="dropdown-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMessage(message);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="dropdown-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-messages">
              <Img
                src="/icons/sad.svg"
                alt="No messages"
                className="empty-icon"
              />
              <p className="empty-text">No messages yet</p>
            </div>
          )}
          <div ref={messagesEndRef} className="messages-end" />
        </div>
      )}

      <div className="message-input-container" ref={emojiPickerRef}>
        <div className="chat-input-wrapper">
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            type="button"
            className="chat-emoji-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
        </div>
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
        {showEmojiPicker && (
          <div className="chat-emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} className="chat-emoji-picker" />
          </div>
        )}
      </div>

      {deleteAlert && (
        <CustomAlert
          title="Delete Message"
          message="Are you sure you want to delete this message? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Chat;
