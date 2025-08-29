import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./routes/HomePage/HomePage";
import ProfilePage from "./routes/ProfilePage/ProfilePage";
import PostPage from "./routes/PostPage/PostPage";
import SearchPage from "./routes/SearchPage/SearchPage";
import CreatePost from "./routes/CreatePost/CreatePost";
import LoginPage from "./routes/LoginPage/LoginPage";
import MainLayout from "./layouts/MainLayout/MainLayout";
import BoardPage from "./routes/BoardPage/BoardPage";
import MessagesPage from "./routes/MessagesPage/MessagesPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/:username" element={<ProfilePage />} />
                <Route path="/pin/:id" element={<PostPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/create" element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                } />
                <Route path="/messages/:conversationId" element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                } />
                <Route path="/board/:boardId" element={<BoardPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
);
