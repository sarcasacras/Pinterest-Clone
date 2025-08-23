import Board from "../models/Board.js";

export const getBoardsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const boards = await Board.find({ owner: userId }).populate("pins");
    const boardsWithEffectiveCover = boards.map((board) => ({
      ...board.toObject(),
      effectiveCoverImage:
        board.coverImage ||
        (board.pins.length > 0 ? board.pins[0].imageUrl : null),
    }));
    res.json({ boards: boardsWithEffectiveCover });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId)
      .populate("pins")
      .populate("owner");
    if (!board) {
      return res.status(404).json({ error: "Board not found!" });
    }
    const effectiveCoverImage =
      board.coverImage ||
      (board.pins.length > 0 ? board.pins[0].imageUrl : null);
    const boardResponse = {
      ...board.toObject(),
      effectiveCoverImage,
    };
    res.json({ board: boardResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBoards = (req, res) => {
  res.send("hello?");
};

export const createBoard = async (req, res) => {
  try {
    const { title, description, owner } = req.body;
    
    if (!title || !owner) {
      return res.status(400).json({ error: "Title and owner are required" });
    }

    const newBoard = new Board({
      title,
      description: description || "",
      owner,
      pins: []
    });

    const savedBoard = await newBoard.save();
    res.status(201).json({ board: savedBoard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (!isAdmin && board.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only delete your own boards" });
    }

    await Board.findByIdAndDelete(boardId);
    
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
