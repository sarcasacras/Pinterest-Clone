import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false, types } = req.query;
    const userId = req.user.id;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true',
      types: types ? types.split(',') : null
    };

    const result = await Notification.getUserNotifications(userId, options);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });
    
    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        error: 'notificationIds must be an array'
      });
    }

    const result = await Notification.markAsRead(notificationIds, userId);
    
    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Notification.markAllAsRead(userId);
    
    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteAllUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Notification.deleteMany({ recipient: userId });
    
    res.json({
      success: true,
      message: 'All notifications deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const cleanOldNotifications = async (req, res) => {
  try {
    const { daysOld = 30 } = req.query;
    
    const result = await Notification.cleanOldNotifications(parseInt(daysOld));
    
    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};