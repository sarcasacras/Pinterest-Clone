import express from 'express';
import { getBoards, getBoardsByUser, getBoardById } from '../controllers/boardsController.js';

const router = express.Router();

router.get('/', getBoards);
router.get('/user/:userId', getBoardsByUser);
router.get('/:boardId', getBoardById);

export default router;