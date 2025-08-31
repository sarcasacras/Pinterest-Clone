import express from "express";
import {
  getPins,
  createPin,
  getPinById,
  updatePin,
  deletePin,
  getPinsByUser,
  toggleLike,
  savePinToBoard,
  removePinFromBoard,
} from "../controllers/pinsController.js";
import { authenticateToken } from "../middleware/auth.js";
import { 
  validateContent, 
  validateIdOrSlug, 
  validateStrictMongoId, 
  validateFileUpload, 
  handleValidationErrors 
} from "../middleware/validation.js";
import multer from "multer";
import { uploadToImageKit } from "../utils/imagekit.js";

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

// Apply security validation to pins routes
router.get("/", getPins);
router.post("/", 
  authenticateToken, 
  upload.single('image'), 
  validateContent, 
  validateFileUpload, 
  handleValidationErrors, 
  createPin
);
// Use flexible validation for pin ID (can be MongoDB ID or slug)
router.get("/:id", validateIdOrSlug('id'), handleValidationErrors, getPinById);
router.put("/:id", 
  authenticateToken, 
  validateIdOrSlug('id'), 
  upload.single('image'), 
  validateContent, 
  validateFileUpload, 
  handleValidationErrors, 
  updatePin
);
router.delete("/:id", 
  authenticateToken, 
  validateIdOrSlug('id'), 
  handleValidationErrors, 
  deletePin
);
router.post("/:id/like", 
  authenticateToken, 
  validateIdOrSlug('id'), 
  handleValidationErrors, 
  toggleLike
);
router.post("/:id/save", 
  authenticateToken, 
  validateIdOrSlug('id'), 
  handleValidationErrors, 
  savePinToBoard
);
// Use strict validation for board operations (boards don't have slugs)
router.delete("/:pinId/board/:boardId", 
  authenticateToken, 
  validateIdOrSlug('pinId'), 
  validateStrictMongoId('boardId'), 
  handleValidationErrors, 
  removePinFromBoard
);
// User ID should be strict MongoDB ID
router.get("/user/:userId", 
  validateStrictMongoId('userId'), 
  handleValidationErrors, 
  getPinsByUser
);

export default router;
