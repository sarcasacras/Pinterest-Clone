import Pin from "../models/Pin.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

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
    const pin = new Pin(req.body);
    const savedPin = await pin.save();
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
    const pin = await Pin.findByIdAndDelete(req.params.id);
    if (!pin) {
      return res.status(404).json({ error: "Pin not found" });
    }
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
