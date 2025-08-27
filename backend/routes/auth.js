import express from "express";
import { register, login, getProfile, logout, updateAvatar, updateProfile } from "../controllers/authController.js";
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

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile', authenticateToken, getProfile);
router.put('/avatar', authenticateToken, upload.single('avatar'), updateAvatar);
router.put('/profile', authenticateToken, updateProfile);
export default router;
