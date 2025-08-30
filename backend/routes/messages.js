import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  startConversation,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage,
  editMessage,
  deleteConversation
} from '../controllers/messageController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/conversations', getConversations);

router.get('/unread-count', getUnreadCount);

router.post('/conversations', startConversation);

router.get('/conversations/:conversationId/messages', getConversationMessages);

router.post('/conversations/:conversationId/messages', sendMessage);

router.patch('/conversations/:conversationId/mark-read', markMessagesAsRead);

router.patch('/messages/:messageId', editMessage);

router.delete('/messages/:messageId', deleteMessage);

router.delete('/conversations/:conversationId', deleteConversation);

export default router;