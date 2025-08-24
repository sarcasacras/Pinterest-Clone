import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const commentsApi = {
  createComment: (pinId, content) =>
    apiClient
      .post("/comments", { pinId: pinId, content: content })
      .then((res) => res.data),

  deleteComment: (commentId) =>
    apiClient
      .delete(`/comments/${commentId}`)
      .then((res) => res.data),
};
