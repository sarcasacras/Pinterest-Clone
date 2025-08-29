import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Ensure exactly 2 participants for direct messaging
conversationSchema.path('participants').validate(function(participants) {
  return participants.length === 2;
}, 'A conversation must have exactly 2 participants');

// Compound index for efficient participant queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ participants: 1, lastActivity: -1 });

// Static method to find or create conversation between two users
conversationSchema.statics.findOrCreateConversation = async function(user1Id, user2Id) {
  // Ensure consistent ordering for participants
  const participants = [user1Id, user2Id].sort();
  
  let conversation = await this.findOne({
    participants: { $all: participants }
  }).populate('participants', 'username displayName avatar')
    .populate('lastMessage');
  
  if (!conversation) {
    conversation = new this({
      participants,
      lastActivity: new Date()
    });
    
    await conversation.save();
    await conversation.populate('participants', 'username displayName avatar');
  }
  
  return conversation;
};

// Static method to get user's conversations
conversationSchema.statics.getUserConversations = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 20
  } = options;
  
  const conversations = await this.find({
    participants: userId
  })
  .populate('participants', 'username displayName avatar')
  .populate({
    path: 'lastMessage',
    populate: {
      path: 'sender',
      select: 'username displayName avatar'
    }
  })
  .sort({ lastActivity: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
  
  // Add unread count for each conversation
  const Message = mongoose.model('Message');
  
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        recipient: userId,
        isRead: false
      });
      
      return {
        ...conversation.toObject(),
        unreadCount
      };
    })
  );
  
  return conversationsWithUnread;
};

// Static method to update last activity when new message is sent
conversationSchema.statics.updateLastActivity = async function(conversationId, lastMessageId) {
  return await this.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: lastMessageId,
      lastActivity: new Date()
    },
    { new: true }
  );
};

export default mongoose.model('Conversation', conversationSchema);