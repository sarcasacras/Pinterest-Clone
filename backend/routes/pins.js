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

router.get("/", getPins);
router.post("/", authenticateToken, upload.single('image'), createPin);
router.get("/:id", getPinById);
router.put("/:id", authenticateToken, upload.single('image'), updatePin);
router.delete("/:id", authenticateToken, deletePin);
router.post("/:id/like", authenticateToken, toggleLike);
router.post("/:id/save", authenticateToken, savePinToBoard);
router.delete("/:pinId/board/:boardId", authenticateToken, removePinFromBoard);
router.get("/user/:userId", getPinsByUser);

export default router;
