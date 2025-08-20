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
