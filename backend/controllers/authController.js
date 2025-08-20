import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import User from "../models/User.js";

export const testAuth = async (req, res) => {
  try {
    const password = "testPassword123";
    const hashedPassword = await hashPassword(password);

    const isMatch = await comparePassword(password, hashedPassword);

    res.json({
      message: "Auth route is still working!",
      test: {
        originalPassword: password,
        hashedPassword: hashedPassword,
        passwordMatch: isMatch,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, displayName, email, password } = req.body;

    if (!username || !displayName || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      username,
      displayName,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = (req, res) => {
  res.json({ message: "Login endpoint - coming soon!" });
};
