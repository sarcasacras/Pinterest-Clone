import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    minlength: [1, 'Display name cannot be empty'],
    maxlength: [50, 'Display name cannot exceed 50 characters'],
    validate: {
      validator: function(v) {
        return v.trim().length > 0;
      },
      message: 'Display name cannot be empty or just whitespace'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [128, 'Password is too long']
  },
  avatar: {
    type: String,
    default: ''
  },
  avatarImageKitFileId: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: function(arr) {
        return arr.length <= 10000;
      },
      message: 'Too many followers'
    }
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: function(arr) {
        return arr.length <= 5000;
      },
      message: 'Following too many users'
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);