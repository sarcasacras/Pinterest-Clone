import express from 'express';
import { getBoards } from '../controllers/boardsController.js';

const router = express.Router();

router.get('/', getBoards);

export default router;