import Pin from "../models/Pin.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Board from "../models/Board.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imagekit.js";
import mongoose from "mongoose";

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
      .populate("owner", "username displayName avatar")
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
      return res.status(400).json({ error: "Image file is required" });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const uploadResult = await uploadToImageKit(req.file, fileName);

    const aspectRatio = uploadResult.height / uploadResult.width;
    const maxAspectRatio = 1.5;
    const slug = req.body.slug;
    let preparedSlug = null;

    if (slug) {
      preparedSlug = slug.trim().toLowerCase();

      if (preparedSlug !== "") {
        const sameSlug = await Pin.findOne({ slug: preparedSlug });
        if (sameSlug) {
          console.log(preparedSlug);
          return res
            .status(400)
            .json({ error: "There is another pin with this slug" });
        } 
      } else {
        preparedSlug = null;
      }
    }

    if (aspectRatio > maxAspectRatio) {
      await deleteFromImageKit(uploadResult.fileId);
      return res.status(400).json({
        error: `Image aspect ratio too large. Maximum allowed is ${maxAspectRatio}:1, but your image is ${aspectRatio.toFixed(
          2
        )}:1. Please use a less tall image.`,
      });
    }

    const tags = req.body.tags
      ? req.body.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const pinData = {
      ...req.body,
      tags: tags,
      imageUrl: uploadResult.url,
      imageKitFileId: uploadResult.fileId,
      width: uploadResult.width,
      height: uploadResult.height,
      owner: req.user._id,
    };

    if (preparedSlug !== null) {
      pinData.slug = preparedSlug;
    }
    
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
    console.log(error);
  }
};

export const getPinById = async (req, res) => {
  try {
    let pin = await Pin.findOne({ slug: req.params.id })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username displayName avatar",
        },
      })
      .populate("owner");

    if (!pin && mongoose.Types.ObjectId.isValid(req.params.id)) {
      pin = await Pin.findById(req.params.id)
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "username displayName avatar",
          },
        })
        .populate("owner");
    }

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
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ error: "Pin not found" });
    }

    if (pin.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    let updateData = { ...req.body };

    if (req.file) {
      // Delete old image from ImageKit if it exists
      if (pin.imageKitFileId) {
        try {
          await deleteFromImageKit(pin.imageKitFileId);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }

      const fileName = `pin-${req.params.id}-${Date.now()}.jpg`;
      const imageResult = await uploadToImageKit(req.file, fileName);
      updateData.imageUrl = imageResult.url;
      updateData.imageKitFileId = imageResult.fileId;
      updateData.width = imageResult.width;
      updateData.height = imageResult.height;
    }

    const updatedPin = await Pin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate('owner', 'username displayName avatar');

    res.json({ pin: updatedPin });
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
      return res
        .status(403)
        .json({ error: "You can only delete your own pins" });
    }

    if (pin.imageKitFileId) {
      try {
        await deleteFromImageKit(pin.imageKitFileId);
      } catch (imageKitError) {
        console.log(imageKitError);
        res.json({ error: imageKitError });
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
      .populate("owner", "username displayName avatar")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username displayName avatar",
        },
      });

    res.json({
      message: isLiked ? "Pin unliked" : "Pin liked",
      pin: updatedPin,
      isLiked: !isLiked,
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
      return res
        .status(403)
        .json({ error: "You can only save pins to your own boards" });
    }

    if (board.pins.includes(pinId)) {
      return res
        .status(400)
        .json({ error: "Pin is already saved to this board" });
    }

    board.pins.push(pinId);
    await board.save();

    res.json({
      message: "Pin saved to board successfully",
      board: board,
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
      return res
        .status(403)
        .json({ error: "You can only remove pins from your own boards" });
    }

    if (!board.pins.includes(pinId)) {
      return res.status(400).json({ error: "Pin is not in this board" });
    }

    board.pins.pull(pinId);
    await board.save();

    res.json({
      message: "Pin removed from board successfully",
      board: board,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
