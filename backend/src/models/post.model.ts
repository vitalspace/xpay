import mongoose, { type Document, Schema } from "mongoose";

interface IPost extends Document {
  id: string; // Unique ID for each post
  userId: mongoose.Types.ObjectId; // Reference to user
  title: string;
  content: string; // Protected content
  postId: string; // Unique public ID for the post
  amount: string; // Payment amount required
  asset: string; // e.g., "XLM"
  destination: string; // Payment destination address
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    postId: { type: String, required: true, unique: true },
    amount: { type: String, required: true },
    asset: { type: String, required: true, default: "XLM" },
    destination: { type: String, required: true },
  },
  { timestamps: true }
);

// Indexes for efficient searches
PostSchema.index({ userId: 1, createdAt: -1 });

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;