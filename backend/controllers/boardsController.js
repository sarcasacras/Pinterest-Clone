import Board from "../models/Board.js";

export const getBoardsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const boards = await Board.find({ owner: userId });
    res.json({ boards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId).populate("pins").populate("owner");
    if (!board) {
      return res.status(404).json({ error: "Board not found!" });
    }
    res.json({ board });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBoards = (req, res) => {
  res.send("hello?");
};
