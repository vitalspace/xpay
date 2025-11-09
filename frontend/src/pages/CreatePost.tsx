import {
  CreditCard,
  Info,
  Loader2,
  QrCode,
  Share2,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Lock,
} from "lucide-react";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import { Toast } from "../components/ui/Toast";
import { useWallet } from "../hooks/useWallet";
import { paymentService } from "../services/api";
import { getPaywallClient } from "../contracts/paywall_contract";

// Validation schema
const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content cannot exceed 10000 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Amount must be a positive number"
    )
    .refine((val) => Number(val) <= 1000, "Amount cannot exceed 1000 XLM"),
  destination: z
    .string()
    .min(1, "Recipient address is required")
    .regex(/^G[A-Z0-9]{55}$/, "Invalid Stellar public key format")
    .optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

export const CreatePost: React.FC = () => {
  const { address, signTransaction } = useWallet();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePostForm, string>>
  >({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [createdPost, setCreatedPost] = useState<{
    title: string;
    content: string;
    postId: string;
    amount: string;
    destination: string;
    createdAt: string;
    qrData?: string;
    txHash?: string;
  } | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setToast({ message: "Copied to clipboard!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to copy to clipboard", type: "error" });
    }
  };

  const validateForm = (): boolean => {
    try {
      createPostSchema.parse({
        title,
        content,
        amount,
        destination: destination || undefined,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CreatePostForm, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof CreatePostForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const createPost = async () => {
    if (!address) {
      setToast({ message: "Please connect your wallet first", type: "error" });
      return;
    }

    if (!validateForm()) {
      setToast({ message: "Please fix the form errors", type: "error" });
      return;
    }

    setLoading(true);

    try {
      // Create post in backend
      const backendResult = await paymentService.createPost({
        userId: address,
        title,
        content,
        amount,
        destination: destination || address,
      });

      const postId = backendResult.postId;
      const finalPostId = backendResult.postId;

      if (!finalPostId) {
        throw new Error("Backend did not return a valid post ID");
      }

      // Create blockchain transaction
      const client = getPaywallClient(address);
      const tx = await client.create_post({
        creator: address,
        post_id: postId,
        price: BigInt(Math.floor(Number(amount) * 10_000_000)),
        destination: destination || address,
      });

      // Sign and send transaction
      await tx.signAndSend({ signTransaction });

      // Show success
      const shareableLink = `${window.location.origin}/post/${postId}`;

      setCreatedPost({
        title,
        content,
        postId: finalPostId,
        amount,
        destination: destination || address,
        createdAt: backendResult.createdAt || new Date().toISOString(),
        qrData: shareableLink,
        txHash: undefined,
      });

      setToast({
        message: "Post created successfully on blockchain!",
        type: "success",
      });

      // Clear form
      setTitle("");
      setContent("");
      setAmount("");
      setDestination("");
    } catch (error) {
      setToast({
        message: `Error: ${(error as Error).message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto max-w-6xl">
        {/* Header with XPay branding */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Create Protected Content
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 ml-15">
            Use X402 protocol to monetize your content with XPay
          </p>
        </div>

        {/* Connected Wallet Banner */}
        {address && (
          <div className="mb-6 bg-white border-2 border-purple-200 rounded-2xl p-4 sm:p-5 shadow-lg shadow-purple-100/50">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">
                  Connected to XPay
                </p>
                <p className="text-xs font-mono text-gray-500 truncate">
                  {address}
                </p>
              </div>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border-2 border-emerald-200 flex items-center gap-1.5 flex-shrink-0 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Connected
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Post Creation Form */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8 border-b-2 border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    Content Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    Set up your X402 protected post
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.title
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Content Field */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Post Content <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal text-xs ml-2">
                    (Markdown supported)
                  </span>
                </label>
                <textarea
                  id="content"
                  placeholder="Write your premium content here..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) {
                      setErrors((prev) => ({ ...prev, content: undefined }));
                    }
                  }}
                  rows={6}
                  disabled={loading}
                  maxLength={10000}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.content
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                  }`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.content ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.content}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Max 10000 characters • Markdown supported
                    </p>
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      content.length > 9500 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {content.length}/10000
                  </span>
                </div>
              </div>

              {/* Amount Field */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Access Price (X402) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) {
                        setErrors((prev) => ({ ...prev, amount: undefined }));
                      }
                    }}
                    step="0.01"
                    min="0"
                    disabled={loading}
                    className={`w-full px-4 py-3 pr-16 bg-white border-2 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.amount
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                    <span className="text-sm font-semibold text-purple-700">
                      XLM
                    </span>
                  </div>
                </div>
                {errors.amount && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Recipient Address */}
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Payment Destination{" "}
                  <span className="text-gray-500 font-normal text-xs">
                    (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  id="destination"
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (errors.destination) {
                      setErrors((prev) => ({
                        ...prev,
                        destination: undefined,
                      }));
                    }
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 font-mono text-xs placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.destination
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-100"
                  }`}
                />
                {errors.destination && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.destination}
                  </p>
                )}
                {!errors.destination && (
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Defaults to your connected wallet if left empty
                  </p>
                )}
              </div>

              {/* Create Button */}
              <button
                type="button"
                onClick={createPost}
                disabled={loading || !address || !title || !content || !amount}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Creating Protected Post...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Create Protected Post</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Post Preview / Created Post */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-xl">
            {!createdPost ? (
              <>
                <div className="p-6 sm:p-8 border-b-2 border-gray-200 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">
                        Post Preview
                      </h2>
                      <p className="text-sm text-gray-500">
                        Your protected content will appear here
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-300 rounded-2xl flex items-center justify-center mb-4">
                      <Lock className="w-20 h-20 text-purple-300" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Create a protected post to see preview
                    </p>
                    <p className="text-xs text-gray-400">
                      Powered by X402 Protocol
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 sm:p-8 border-b-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">
                        Post Created Successfully!
                      </h2>
                      <p className="text-sm text-gray-600">
                        Your content is now protected with X402 on Stellar
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {createdPost.qrData && (
                    <div className="flex items-center justify-center">
                      <div className="p-6 bg-white border-2 border-purple-200 rounded-2xl shadow-lg">
                        <QRCode
                          value={createdPost.qrData}
                          size={200}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        Title
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {createdPost.title}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-sm font-medium text-gray-600 block mb-2">
                        Content Preview
                      </span>
                      <div className="text-sm text-gray-900 prose prose-sm max-w-none">
                        <ReactMarkdown>{createdPost.content}</ReactMarkdown>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-sm font-medium text-gray-600">
                        Post ID
                      </span>
                      <span className="text-sm font-mono font-bold text-gray-900">
                        {createdPost.postId}
                      </span>
                    </div>
                    {createdPost.txHash && (
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">
                          Transaction
                        </span>
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${createdPost.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-purple-600 hover:text-purple-700 hover:underline font-semibold"
                        >
                          {createdPost.txHash.slice(0, 8)}...
                          {createdPost.txHash.slice(-8)}
                        </a>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <span className="text-sm font-medium text-gray-600">
                        Access Price (X402)
                      </span>
                      <span className="text-sm font-bold text-purple-700">
                        {createdPost.amount} XLM
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-sm font-medium text-gray-600">
                        Destination
                      </span>
                      <span className="text-sm font-mono text-gray-900 text-xs truncate max-w-[200px]">
                        {createdPost.destination}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-sm font-medium text-gray-600">
                        Status
                      </span>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full capitalize border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Active & Protected
                      </span>
                    </div>
                  </div>

                  {createdPost.qrData && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Payment Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={createdPost.qrData}
                          readOnly
                          className="flex-1 px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm font-mono text-gray-700"
                        />
                        <button
                          onClick={() => copyToClipboard(createdPost.qrData!)}
                          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-500/30"
                        >
                          {copiedLink ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {createdPost.qrData && (
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: "Protected Content - XPay",
                            text: `Pay ${createdPost.amount} XLM to access: ${createdPost.title}`,
                            url: createdPost.qrData,
                          });
                        } else {
                          copyToClipboard(createdPost.qrData!);
                        }
                      }}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share Protected Link</span>
                    </button>
                  )}

                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium mb-1">
                      🔒 Protected by X402 Protocol
                    </p>
                    <p className="text-xs text-blue-700">
                      Users must pay {createdPost.amount} XLM to access this content
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Network Info Footer */}
        <div className="mt-6 bg-white border-2 border-blue-200 rounded-2xl p-4 sm:p-5 shadow-lg shadow-blue-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  XPay Network
                </p>
                <p className="text-xs text-gray-500">
                  Stellar + X402 Protocol • Testnet
                </p>
              </div>
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-sm font-semibold rounded-xl border-2 border-blue-200 inline-flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Stellar Testnet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
