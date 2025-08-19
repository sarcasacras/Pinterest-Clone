import express from 'express';
import { getUsers, getUsersByUsername } from '../controllers/usersController.js';


const router = express.Router();

router.get('/', getUsers);
router.get('/:username', getUsersByUsername);

export default router;