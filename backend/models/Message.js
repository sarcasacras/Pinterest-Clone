import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

messageSchema.statics.getConversationMessages = async function(conversationId, options = {}) {
  const {
    page = 1,
    limit = 50,
    beforeDate = null
  } = options;
  
  const filter = { conversationId };
  
  if (beforeDate) {
    filter.createdAt = { $lt: new Date(beforeDate) };
  }
  
  const messages = await this.find(filter)
    .populate('sender', 'username displayName avatar')
    .populate('recipient', 'username displayName avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  return messages.reverse();
};

messageSchema.statics.markAsRead = async function(messageId, userId) {
  const message = await this.findOne({
    _id: messageId,
    recipient: userId,
    isRead: false
  });
  
  if (message) {
    message.isRead = true;
    message.readAt = new Date();
    await message.save();
  }
  
  return message;
};

messageSchema.statics.markConversationAsRead = async function(conversationId, userId) {
  return await this.updateMany(
    {
      conversationId,
      recipient: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );
};

messageSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

export default mongoose.model('Message', messageSchema);