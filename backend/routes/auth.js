import express from "express";
import { testAuth, register, login, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/test', testAuth);

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticateToken, getProfile);
export default router;
