import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["ADMIN", "STAFF"], default: "STAFF" },
    avatar: {
      type: String, // image URL
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
