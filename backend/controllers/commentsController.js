import Comment from "../models/Comment.js";
import Pin from "../models/Pin.js";

export const getComments = (req, res) => {
  res.json({ message: "Comments route working!" });
};

export const createComment = async (req, res) => {
  try {
    const { content, pinId } = req.body;

    if (!content || !pinId) {
      return res
        .status(400)
        .json({ error: "Content and Pin ID are required!" });
    }
    const userId = req.user._id;
    const newComment = new Comment({
      content: content,
      author: userId,
      pin: pinId,
    });
    const savedComment = await newComment.save();

    const currentPin = await Pin.findById(pinId);
    currentPin.comments.push(savedComment._id);
    await currentPin.save();
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "author"
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId).populate("author");
    if (!comment) {
      return res.status(404).json({message: "Comment not found!"});
    }
    const pinId = comment.pin.toString();
    const pin = await Pin.findById(pinId);
    const user = req.user;
    if (comment.author._id.toString() !== user._id.toString() && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments!" });
    }
    pin.comments.pull(commentId);
    await Comment.findByIdAndDelete(commentId);
    await pin.save();
    res.json({message: "The comment was successfully deleted!"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
