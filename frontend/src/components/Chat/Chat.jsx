import "./Chat.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "../../api/messagesApi";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

const Chat = ({ conversationId, conversation }) => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessageMutation.mutate(messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            <img
              src={otherParticipant?.avatar || "/general/noavatar.svg"}
              alt={otherParticipant?.displayName}
            />
          </div>
          <h2 className="chat-user-name">
            {otherParticipant?.displayName || "Unknown User"}
          </h2>
        </div>
      </div>
      {isLoading && <p>Loading messages...</p>}
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
                      {message.sender.displayName}
                    </div>
                  )}
                  <div
                    className={`message-item ${
                      isOwnMessage ? "own-message" : "other-message"
                    } ${!showSender ? "grouped-message" : ""}`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No messages yet</p>
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
    </div>
  );
};

export default Chat;
