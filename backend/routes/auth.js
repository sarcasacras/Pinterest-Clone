import express from "express";
import { testAuth, register, login, getProfile, logout } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/test', testAuth);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile', authenticateToken, getProfile);
export default router;
