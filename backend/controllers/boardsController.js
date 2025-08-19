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

export const getBoards = (req, res) => {
  res.send("hello?");
};
