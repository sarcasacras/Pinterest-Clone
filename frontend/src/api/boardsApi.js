import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const boardsApi = {
  getBoardsByUser: (userId) =>
    apiClient.get(`/boards/user/${userId}`).then((res) => res.data),
  getBoardById: (boardId) =>
    apiClient.get(`/boards/${boardId}`).then((res) => res.data),
  createBoard: (boardData) =>
    apiClient.post('/boards', boardData).then((res) => res.data),
  deleteBoard: (boardId) =>
    apiClient.delete(`/boards/${boardId}`).then((res) => res.data),
};
