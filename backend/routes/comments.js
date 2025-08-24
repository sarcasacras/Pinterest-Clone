import express from "express";
import {
  getComments,
  createComment,
  deleteComment
} from "../controllers/commentsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", authenticateToken, createComment);
router.delete("/:id", authenticateToken, deleteComment);

export default router;
