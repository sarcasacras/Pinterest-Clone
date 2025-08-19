import express from 'express';
import { getBoards, getBoardsByUser } from '../controllers/boardsController.js';

const router = express.Router();

router.get('/', getBoards);
router.get('/user/:userId', getBoardsByUser);

export default router;