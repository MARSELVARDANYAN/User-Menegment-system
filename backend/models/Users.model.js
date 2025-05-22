import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: () => Date.now().toString(),
    },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user",
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
