import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const getConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    const conversations = await Conversation.getUserConversations(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      conversations,
      total: conversations.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50, beforeDate } = req.query;
    const userId = req.user.id;

    // Verify user is part of this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found or access denied",
      });
    }

    const messages = await Message.getConversationMessages(conversationId, {
      page: parseInt(page),
      limit: parseInt(limit),
      beforeDate,
    });

    res.json({
      success: true,
      messages,
      conversationId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    }).populate("participants");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found or access denied",
      });
    }

    const recipient = conversation.participants.find(
      (participant) => participant._id.toString() !== senderId.toString()
    );

    const message = new Message({
      conversationId,
      sender: senderId,
      recipient: recipient._id,
      content: content.trim(),
    });

    await message.save();

    await message.populate("sender", "username displayName avatar");

    await Conversation.updateLastActivity(conversationId, message._id);

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        error: "Recipient ID is required",
      });
    }

    if (senderId.toString() === recipientId.toString()) {
      return res.status(400).json({
        success: false,
        error: "Cannot start conversation with yourself",
      });
    }

    // Validate that recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: "Recipient user not found",
      });
    }

    const conversation = await Conversation.findOrCreateConversation(
      senderId,
      recipientId
    );

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found or access denied",
      });
    }

    const result = await Message.markConversationAsRead(conversationId, userId);

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Message.getUnreadCount(userId);

    res.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Find the message and verify the user is the sender
    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found or access denied",
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    // Find the message and verify the user is the sender
    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found or access denied",
      });
    }

    // Update the message content
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content: content.trim() },
      { new: true }
    ).populate("sender", "username displayName avatar");

    res.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found or access denied",
      });
    }

    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
