import express from "express";
import { testAuth, register, login } from "../controllers/authController.js";

const router = express.Router();

router.get('/test', testAuth);

router.post('/register', register);
router.post('/login', login);

export default router;
