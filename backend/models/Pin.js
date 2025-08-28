import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      validate: {
        validator: function(v) {
          return v.trim().length > 0;
        },
        message: 'Title cannot be empty or just whitespace'
      }
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
      trim: true,
      minlength: [3, 'Slug must be at least 3 characters long'],
      maxlength: [100, 'Slug cannot exceed 100 characters'],
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^[a-z0-9-]+$/.test(v);
        },
        message: 'Slug can only contain lowercase letters, numbers, and hyphens'
      }
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: "",
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      validate: {
        validator: function(v) {
          return typeof v === 'string' && v.length > 0;
        },
        message: 'Image URL cannot be empty'
      }
    },
    width: {
      type: Number,
      default: 400,
      min: [100, 'Image width must be at least 100px'],
      max: [10000, 'Image width cannot exceed 10000px']
    },
    height: {
      type: Number,
      default: 600,
      min: [100, 'Image height must be at least 100px'],
      max: [15000, 'Image height cannot exceed 15000px']
    },
    imageKitFileId: {
      type: String,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Owner is required'],
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
    likes: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      validate: {
        validator: function(arr) {
          return arr.length <= 100000;
        },
        message: 'Too many likes'
      }
    },
    comments: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      }],
      validate: {
        validator: function(arr) {
          return arr.length <= 10000;
        },
        message: 'Too many comments'
      }
    },
    tags: {
      type: [{
        type: String,
        trim: true,
        minlength: [1, 'Tag cannot be empty'],
        maxlength: [30, 'Tag cannot exceed 30 characters'],
        validate: {
          validator: function(v) {
            return /^[a-zA-Z0-9_\-\s]+$/.test(v);
          },
          message: 'Tag can only contain letters, numbers, underscores, hyphens, and spaces'
        }
      }],
      validate: {
        validator: function(arr) {
          return arr.length <= 20;
        },
        message: 'Too many tags (maximum 20 allowed)'
      }
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pin", pinSchema);
