import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const boardsApi = {
  getBoardsByUser: (userId) =>
    apiClient.get(`/boards/user/${userId}`).then((res) => res.data),
};
