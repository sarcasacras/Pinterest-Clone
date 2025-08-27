import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'save', 'pin_added_to_board'],
    required: true
  },
  
  pin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pin',
    required: function() {
      return ['like', 'comment', 'save', 'pin_added_to_board'].includes(this.type);
    }
  },
  
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: function() {
      return ['save', 'pin_added_to_board'].includes(this.type);
    }
  },
  
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: function() {
      return this.type === 'comment';
    }
  },
  
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });

notificationSchema.statics.createNotification = async function(data) {
  const { recipient, sender, type, pin, board, comment, metadata } = data;
  
  if (recipient.toString() === sender.toString()) {
    return null;
  }
  
  const existingNotification = await this.findOne({
    recipient,
    sender,
    type,
    ...(pin && { pin }),
    ...(board && { board }),
    ...(comment && { comment }),
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });
  
  if (existingNotification) {
    existingNotification.createdAt = new Date();
    existingNotification.isRead = false;
    return await existingNotification.save();
  }
  
  const notification = new this({
    recipient,
    sender,
    type,
    pin,
    board,
    comment,
    metadata
  });
  
  return await notification.save();
};

notificationSchema.statics.getUserNotifications = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    types = null
  } = options;
  
  const filter = { recipient: userId };
  
  if (unreadOnly) {
    filter.isRead = false;
  }
  
  if (types) {
    filter.type = { $in: types };
  }
  
  const notifications = await this.find(filter)
    .populate('sender', 'username displayName avatar')
    .populate('pin', 'title imageUrl slug')
    .populate('board', 'title')
    .populate('comment', 'content')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  const total = await this.countDocuments(filter);
  const unreadCount = await this.countDocuments({ 
    recipient: userId, 
    isRead: false 
  });
  
  return {
    notifications,
    total,
    unreadCount,
    hasMore: page * limit < total
  };
};

notificationSchema.statics.markAsRead = async function(notificationIds, userId) {
  return await this.updateMany(
    { 
      _id: { $in: notificationIds },
      recipient: userId 
    },
    { isRead: true }
  );
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
};

notificationSchema.statics.cleanOldNotifications = async function(daysOld = 30) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return await this.deleteMany({ 
    createdAt: { $lt: cutoffDate },
    isRead: true 
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;