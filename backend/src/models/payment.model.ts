import mongoose, { type Document, Schema } from "mongoose";

interface IPayment extends Document {
  id: string; // Unique ID for each payment
  userId: mongoose.Types.ObjectId; // Referencia al usuario
  amount: string;
  asset: string; // e.g., "XLM" o código de asset
  destination: string;
  transactionHash?: string; // Optional for payment requests
  memo?: string;
  status: "pending" | "completed" | "failed" | "active";
  paymentRequestId?: string; // Unique ID for payment requests
  isPaymentRequest: boolean; // True for generated payment requests
  title?: string; // For posts
  content?: string; // For posts
  postId?: string; // Unique ID for posts
  isPost: boolean; // True for created posts
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: String, required: true },
    asset: { type: String, required: true },
    destination: { type: String, required: true },
    transactionHash: { type: String, sparse: true }, // Make optional and sparse, removed unique constraint
    memo: { type: String },
    status: { type: String, enum: ["pending", "completed", "failed", "active"], default: "pending" },
    paymentRequestId: { type: String, sparse: true, unique: true }, // Unique ID for payment requests
    isPaymentRequest: { type: Boolean, default: false },
    title: { type: String }, // For posts
    content: { type: String }, // For posts
    postId: { type: String, sparse: true, unique: true }, // Unique ID for posts
    isPost: { type: Boolean, default: false }, // True for created posts
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;