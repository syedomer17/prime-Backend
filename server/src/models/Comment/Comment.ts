import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  blogId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog", // Ensure it matches the correct model name
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Ensure it matches the correct model name
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const commentModel = mongoose.model<IComment>("comment", commentSchema);
export default commentModel;
