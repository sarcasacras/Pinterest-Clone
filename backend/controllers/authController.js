import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import User from "../models/User.js";
import { generateToken, verifyToken } from "../utils/generateToken.js";

export const testAuth = async (req, res) => {
  try {
    const password = "testPassword123";
    const hashedPassword = await hashPassword(password);
    const isMatch = await comparePassword(password, hashedPassword);

    const testUserId = "60d5ec49f1b2c8b1f8e4e1a1";
    const token = generateToken(testUserId);
    const decoded = verifyToken(token);

    res.json({
      message: "Auth route is still working!",
      test: {
        originalPassword: password,
        hashedPassword: hashedPassword,
        passwordMatch: isMatch,
      },
      jwtTest: {
        generatedToken: token,
        decodedToken: decoded,
        tokenValid: decoded.userId === testUserId,
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

    const token = generateToken(user._id);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials!",
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials!",
      });
    }

    const token = generateToken(user._id);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful!",
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

export const logout = (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  })

  res.json({
    message: "Logout successful"
  })
}

export const getProfile = (req, res) => {
    res.json({
        message: "Access to protected route successful!",
        user: req.user
    })
}
