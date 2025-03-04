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
    newImageUrl: String, // ✅ Added field
    imgbbId: String, // ✅ Added field
    displayUrl: String, // ✅ Added field
    thumbnailUrl: String, // ✅ Added field
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Image", imageSchema);
