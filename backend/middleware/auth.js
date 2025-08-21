import { verifyToken } from "../utils/generateToken.js";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        error: "Invalid token. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid token.",
    });
  }
};
