import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imagekit.js";

// Utility function to get uniform cookie options for all browsers
const getCookieOptions = (maxAge = 7 * 24 * 60 * 60 * 1000) => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
    maxAge,
    path: '/',
  };
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
    const cookieOptions = getCookieOptions();

    res.cookie("authToken", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
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
    const cookieOptions = getCookieOptions();

    res.cookie("authToken", token, cookieOptions);

    // Debug logging for production
    if (process.env.NODE_ENV === 'production') {
      console.log('🍪 Setting cookie with options:', cookieOptions);
      console.log('🌍 Request origin:', req.headers.origin);
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  const clearOptions = getCookieOptions(0);
  delete clearOptions.maxAge; // Remove maxAge for clearing

  res.clearCookie('authToken', clearOptions);

  res.json({
    message: "Logout successful"
  });
}

export const getProfile = (req, res) => {
    res.json({
        message: "Access to protected route successful!",
        user: req.user
    })
}

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Avatar file is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old avatar from ImageKit if it exists
    if (user.avatarImageKitFileId) {
      try {
        await deleteFromImageKit(user.avatarImageKitFileId);
      } catch (error) {
        console.error('Failed to delete old avatar:', error);
      }
    }

    const fileName = `avatar-${req.user._id}-${Date.now()}-${req.file.originalname}`;
    const uploadResult = await uploadToImageKit(req.file, fileName, 'avatars');

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        avatar: uploadResult.url,
        avatarImageKitFileId: uploadResult.fileId
      },
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    ).select("-password");

    res.json({
      message: "Avatar updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, displayName } = req.body;

    if (!username || !displayName) {
      return res.status(400).json({
        error: "Username and display name are required"
      });
    }

    // Check if the new username is already taken by another user
    if (username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          error: "Username is already taken"
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        username: username.trim(),
        displayName: displayName.trim()
      },
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
