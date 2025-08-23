import express from 'express';
import { getBoards, getBoardsByUser, getBoardById, createBoard, deleteBoard } from '../controllers/boardsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBoards);
router.post('/', createBoard);
router.get('/user/:userId', getBoardsByUser);
router.get('/:boardId', getBoardById);
router.delete('/:boardId', authenticateToken, deleteBoard);

export default router;