import express from "express";
import {
  getComments,
  createComment,
  deleteComment
} from "../controllers/commentsController.js";
import { authenticateToken } from "../middleware/auth.js";
import { 
  validateComment, 
  validateMongoId, 
  handleValidationErrors 
} from "../middleware/validation.js";

const router = express.Router();

// Apply security validation to comments routes
router.get("/", getComments);
router.post("/", 
  authenticateToken, 
  validateComment, 
  handleValidationErrors, 
  createComment
);
router.delete("/:id", 
  authenticateToken, 
  validateMongoId('id'), 
  handleValidationErrors, 
  deleteComment
);

export default router;
