import Pin from "../models/Pin.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Board from "../models/Board.js";
import { uploadToImageKit, deleteFromImageKit } from '../utils/imagekit.js';

export const getPins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ],
      };
    }

    const pins = await Pin.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    const totalPins = await Pin.countDocuments(filter);

    const hasMore = skip + pins.length < totalPins;

    res.json({
      pins,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPin = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const uploadResult = await uploadToImageKit(req.file, fileName);

    const aspectRatio = uploadResult.height / uploadResult.width;
    const maxAspectRatio = 1.5;
    
    if (aspectRatio > maxAspectRatio) {
      await deleteFromImageKit(uploadResult.fileId);
      return res.status(400).json({ 
        error: `Image aspect ratio too large. Maximum allowed is ${maxAspectRatio}:1, but your image is ${aspectRatio.toFixed(2)}:1. Please use a less tall image.` 
      });
    }

    const tags = req.body.tags ? 
      req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : 
      [];

    const pinData = {
      ...req.body,
      tags: tags,
      imageUrl: uploadResult.url,
      imageKitFileId: uploadResult.fileId,
      width: uploadResult.width,
      height: uploadResult.height,
      owner: req.user._id
    };
    const pin = new Pin(pinData);
    const savedPin = await pin.save();

    // If a board is specified, add the pin to the board
    if (req.body.board) {
      const board = await Board.findById(req.body.board);
      if (board && board.owner.toString() === req.user._id.toString()) {
        board.pins.push(savedPin._id);
        await board.save();
      }
    }

    res.status(201).json(savedPin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPinById = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id)
      .populate("owner", "username displayName avatar")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username displayName avatar",
        },
      });
    if (!pin) {
      return res.status(404).json({ error: "Pin not found" });
    }
    res.json(pin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePin = async (req, res) => {
  try {
    const pin = await Pin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pin) {
      return res.status(404).json({ error: "Pin not found" });
    }
    res.json(pin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ error: "Pin not found" });
    }

    if (pin.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "You can only delete your own pins" });
    }

    if (pin.imageKitFileId) {
      try {
        await deleteFromImageKit(pin.imageKitFileId);
      } catch (imageKitError) {
        // Failed to delete from ImageKit - continue with pin deletion
      }
    }

    await Pin.findByIdAndDelete(req.params.id);
    res.json({ message: "Pin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPinsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pins = await Pin.find({ owner: userId })
      .populate("owner", "username displayName avatar")
      .sort({ _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Pin.countDocuments({ owner: userId });
    const hasMore = page * limit < total;

    res.json({ pins, hasMore, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ error: "Pin not found" });
    }

    const userId = req.user._id;
    const isLiked = pin.likes.includes(userId);

    if (isLiked) {
      pin.likes.pull(userId);
    } else {
      pin.likes.push(userId);
    }

    await pin.save();
    
    const updatedPin = await Pin.findById(req.params.id)
      .populate("owner", "username displayName avatar");

    res.json({
      message: isLiked ? "Pin unliked" : "Pin liked",
      pin: updatedPin,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const savePinToBoard = async (req, res) => {
  try {
    const { id: pinId } = req.params;
    const { boardId } = req.body;
    const userId = req.user._id;

    const pin = await Pin.findById(pinId);
    if (!pin) {
      return res.status(404).json({ error: "Pin not found" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.owner.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "You can only save pins to your own boards" });
    }

    if (board.pins.includes(pinId)) {
      return res.status(400).json({ error: "Pin is already saved to this board" });
    }

    board.pins.push(pinId);
    await board.save();

    res.json({ 
      message: "Pin saved to board successfully",
      board: board
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removePinFromBoard = async (req, res) => {
  try {
    const { pinId, boardId } = req.params;
    const userId = req.user._id;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.owner.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "You can only remove pins from your own boards" });
    }

    if (!board.pins.includes(pinId)) {
      return res.status(400).json({ error: "Pin is not in this board" });
    }

    board.pins.pull(pinId);
    await board.save();

    res.json({ 
      message: "Pin removed from board successfully",
      board: board
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
