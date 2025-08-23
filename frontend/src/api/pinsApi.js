import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const pinsApi = {
  getPins: ({ page = 1, limit = 20, search = "" } = {}) =>
    apiClient
      .get("/pins", { params: { page, limit, ...(search && { search }) } })
      .then((res) => res.data),

  getPinsByUser: ({ userId, page = 1, limit = 10 }) =>
    apiClient
      .get(`/pins/user/${userId}`, { params: { page, limit } })
      .then((res) => res.data),

  getPinById: (id) => apiClient.get(`/pins/${id}`).then((res) => res.data),

  createPin: (pinData) =>
    apiClient.post("/pins", pinData).then((res) => res.data),

  updatePin: (id, pinData) =>
    apiClient.put(`/pins/${id}`, pinData).then((res) => res.data),

  deletePin: (id) => apiClient.delete(`/pins/${id}`).then((res) => res.data),

  toggleLike: (id) => apiClient.post(`/pins/${id}/like`).then((res) => res.data),
};
