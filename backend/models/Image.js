const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imgbbUrl: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    aspectRatio: {
      type: String,
      required: true,
    },
    seed: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model("Image", imageSchema);