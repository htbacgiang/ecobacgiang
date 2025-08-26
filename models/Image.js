import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
    },

    altText: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: String,
      default: "ecobacgiang",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Image || mongoose.model("Image", imageSchema);
