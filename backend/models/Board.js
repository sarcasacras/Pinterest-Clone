import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 75,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pins: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pin",
        },
      ],
      validate: {
        validator: function (pins) {
          return pins.length <= 100;
        },
        message: "A board cannot have more than 100 pins",
      },
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Board", boardSchema);
