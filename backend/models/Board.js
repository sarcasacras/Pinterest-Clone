import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      minlength: [1, 'Board title cannot be empty'],
      maxlength: [75, 'Board title cannot exceed 75 characters'],
      validate: {
        validator: function(v) {
          return v.trim().length > 0;
        },
        message: 'Board title cannot be empty or just whitespace'
      }
    },
    description: {
      type: String,
      maxlength: [500, 'Board description cannot exceed 500 characters'],
      default: "",
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Board owner is required'],
    },
    pins: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pin",
      }],
      validate: [
        {
          validator: function (pins) {
            return pins.length <= 1000;
          },
          message: "A board cannot have more than 1000 pins",
        },
        {
          validator: function (pins) {
            const uniquePins = new Set(pins.map(pin => pin.toString()));
            return uniquePins.size === pins.length;
          },
          message: "Duplicate pins are not allowed in a board",
        }
      ]
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      default: "",
      maxlength: [500, 'Cover image URL is too long'],
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Board", boardSchema);
