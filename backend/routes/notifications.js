import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  cleanOldNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/mark-read', authenticateToken, markAsRead);
router.patch('/mark-all-read', authenticateToken, markAllAsRead);
router.delete('/:id', authenticateToken, deleteNotification);
router.delete('/cleanup/old', authenticateToken, cleanOldNotifications);

export default router;