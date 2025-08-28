import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const notificationsApi = {
  getNotifications: ({ page = 1, limit = 20 } = {}) =>
    apiClient
      .get("/notifications", { params: { page, limit } })
      .then((res) => res.data),

  markAllAsRead: () =>
    apiClient
      .patch("/notifications/mark-all-read")
      .then((res) => res.data),
};