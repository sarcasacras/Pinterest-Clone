import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  startConversation,
  markMessagesAsRead,
  getUnreadCount
} from '../controllers/messageController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/conversations', getConversations);

router.get('/unread-count', getUnreadCount);

router.post('/conversations', startConversation);

router.get('/conversations/:conversationId/messages', getConversationMessages);

router.post('/conversations/:conversationId/messages', sendMessage);

router.patch('/conversations/:conversationId/mark-read', markMessagesAsRead);

export default router;