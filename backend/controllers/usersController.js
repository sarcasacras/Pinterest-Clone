import User from "../models/User.js";

export const getUsers = (req, res) => {
  res.json({ message: "Users route working!" });
};

export const getUsersByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log("Unexpected error occured", error.message);
    res.status(500).json({ error: error.message });
  }
};
