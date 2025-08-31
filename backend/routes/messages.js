import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  validateMessage, 
  validateMongoId, 
  handleValidationErrors 
} from '../middleware/validation.js';
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

// Apply security validation to messages routes
router.get('/conversations', getConversations);

router.get('/unread-count', getUnreadCount);

router.post('/conversations', startConversation);

router.get('/conversations/:conversationId/messages', 
  validateMongoId('conversationId'), 
  handleValidationErrors, 
  getConversationMessages
);

router.post('/conversations/:conversationId/messages', 
  validateMongoId('conversationId'), 
  validateMessage, 
  handleValidationErrors, 
  sendMessage
);

router.patch('/conversations/:conversationId/mark-read', 
  validateMongoId('conversationId'), 
  handleValidationErrors, 
  markMessagesAsRead
);

router.patch('/messages/:messageId', 
  validateMongoId('messageId'), 
  validateMessage, 
  handleValidationErrors, 
  editMessage
);

router.delete('/messages/:messageId', 
  validateMongoId('messageId'), 
  handleValidationErrors, 
  deleteMessage
);

router.delete('/conversations/:conversationId', 
  validateMongoId('conversationId'), 
  handleValidationErrors, 
  deleteConversation
);

export default router;