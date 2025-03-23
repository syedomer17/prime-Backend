import mongoose, { Schema, Document } from "mongoose";

 export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  userVerified: {
    email: boolean;
  };
  userVerifiedToken?: {
    email?: string;
  };
  githubId?: string; // Add GitHub OAuth ID
  authProvider: "local" | "github"; // Track auth method
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: function () { return !this.githubId; } }, // Optional for OAuth
    avatar: { type: String, default: "" },
    userVerified: {
      email: { type: Boolean, required: true, default: false },
    },
    userVerifiedToken: {
      email: { type: String, default: "" },
    },
    githubId: { type: String, unique: true, sparse: true }, // Unique GitHub ID
    authProvider: { type: String, required: true, enum: ["local", "github"], default: "local" },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUser>("user", userSchema);
export default userModel;
