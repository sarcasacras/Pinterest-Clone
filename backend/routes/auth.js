import express from "express";
import { register, login, getProfile, logout, updateAvatar, updateProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { 
  validateAuth, 
  validateRegistration, 
  validateFileUpload, 
  handleValidationErrors 
} from "../middleware/validation.js";
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

// Apply security validation to auth routes
router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateAuth, handleValidationErrors, login);
router.post('/logout', logout);

router.get('/profile', authenticateToken, getProfile);
router.put('/avatar', 
  authenticateToken, 
  upload.single('avatar'), 
  validateFileUpload, 
  handleValidationErrors, 
  updateAvatar
);
router.put('/profile', 
  authenticateToken, 
  validateRegistration, 
  handleValidationErrors, 
  updateProfile
);
export default router;
