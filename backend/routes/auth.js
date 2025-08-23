import express from "express";
import { testAuth, register, login, getProfile, logout, updateAvatar } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false)
    }
  },
});

router.get('/test', testAuth);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile', authenticateToken, getProfile);
router.put('/avatar', authenticateToken, upload.single('avatar'), updateAvatar);
export default router;
