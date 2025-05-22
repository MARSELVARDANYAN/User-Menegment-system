import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
    data: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("File", FileSchema);
