import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const messagesApi = {
  // Get user's conversations (inbox)
  getConversations: ({ page = 1, limit = 20 } = {}) =>
    apiClient
      .get("/messages/conversations", { params: { page, limit } })
      .then((res) => res.data),

  // Get messages for a specific conversation
  getConversationMessages: (conversationId, { page = 1, limit = 50, beforeDate } = {}) =>
    apiClient
      .get(`/messages/conversations/${conversationId}/messages`, {
        params: { page, limit, beforeDate }
      })
      .then((res) => res.data),

  // Send a message to a conversation
  sendMessage: (conversationId, content) =>
    apiClient
      .post(`/messages/conversations/${conversationId}/messages`, { content })
      .then((res) => res.data),

  // Start a new conversation
  startConversation: (recipientId) =>
    apiClient
      .post("/messages/conversations", { recipientId })
      .then((res) => res.data),

  // Mark messages as read in a conversation
  markMessagesAsRead: (conversationId) =>
    apiClient
      .patch(`/messages/conversations/${conversationId}/mark-read`)
      .then((res) => res.data),

  // Get unread message count
  getUnreadCount: () =>
    apiClient
      .get("/messages/unread-count")
      .then((res) => res.data),

  // Delete a conversation
  deleteConversation: (conversationId) =>
    apiClient
      .delete(`/messages/conversations/${conversationId}`)
      .then((res) => res.data),

  // Delete a message
  deleteMessage: (messageId) =>
    apiClient
      .delete(`/messages/messages/${messageId}`)
      .then((res) => res.data),

  // Edit a message
  editMessage: (messageId, content) =>
    apiClient
      .patch(`/messages/messages/${messageId}`, { content })
      .then((res) => res.data),
};