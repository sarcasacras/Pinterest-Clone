import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authApi = {
  login: (username, password) =>
    apiClient
      .post("/auth/login", { username, password })
      .then((res) => res.data),

  register: (userData) =>
    apiClient.post("/auth/register", userData).then((res) => res.data),

  logout: () => apiClient.post("/auth/logout").then((res) => res.data),

  getProfile: () => apiClient.get("/auth/profile").then((res) => res.data),
  
  updateAvatar: (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return apiClient.put("/auth/avatar", formData).then((res) => res.data);
  },
};
