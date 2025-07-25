import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./routes/HomePage/HomePage";
import ProfilePage from "./routes/ProfilePage/ProfilePage";
import PostPage from "./routes/PostPage/PostPage";
import SearchPage from "./routes/SearchPage/SearchPage";
import CreatePost from "./routes/CreatePost/CreatePost";
import LoginPage from "./routes/LoginPage/LoginPage";
import MainLayout from "./layouts/MainLayout/MainLayout";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/pin/:id" element={<PostPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/create" element={<CreatePost />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
