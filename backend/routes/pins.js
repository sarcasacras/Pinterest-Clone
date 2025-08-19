import express from 'express';
import { getPins, createPin, getPinById, updatePin, deletePin, getPinsByUser } from '../controllers/pinsController.js';

const router = express.Router();

router.get('/', getPins);
router.post('/', createPin);
router.get('/:id', getPinById);
router.put('/:id', updatePin);
router.delete('/:id', deletePin);
router.get('/user/:userId', getPinsByUser);

export default router;