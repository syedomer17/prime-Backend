import mongoose, { Schema, Document } from "mongoose";

interface IBlog extends Document {
  author: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  summary?: string; // AI-generated summary
  tags?: string[];
  category: string;
  views: number;
}

const blogSchema = new Schema<IBlog>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Ensure it matches the correct model name
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const blogModel = mongoose.model<IBlog>("blog", blogSchema);
export default blogModel;
