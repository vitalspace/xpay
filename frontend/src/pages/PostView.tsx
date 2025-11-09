import { Horizon } from "@stellar/stellar-sdk";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  Shield,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { Toast } from "../components/ui/Toast";
import { getPaywallClient } from "../contracts/paywall_contract";
import { networkPassphrase } from "../contracts/util";
import { useWallet } from "../hooks/useWallet";
import { paymentService } from "../services/api";
import { wallet } from "../util/wallet";

export const PostView: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { address } = useWallet();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [post, setPost] = useState<{
    paymentRequestId: string;
    amount: string;
    asset: string;
    destination: string;
    memo?: string;
    status: string;
    createdAt: string;
    userAddress: string;
    title?: string;
    content?: string;
    hasAccess?: boolean;
    isCreator?: boolean;
  } | null>(null);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      const data = await paymentService.getPost(postId!, address);
      setPost(data);
    } catch (error) {
      console.error("Error loading post:", error);
      setToast({ message: "Post not found", type: "error" });
    }
    setLoading(false);
  };

  const getHorizonUrl = () => {
    return "https://horizon-testnet.stellar.org";
  };

  const payForPost = async () => {
    if (!address || !post) {
      setToast({ message: "Please connect your wallet first", type: "error" });
      return;
    }

    if (post.status !== "pending") {
      setToast({
        message: "This post has already been paid for",
        type: "error",
      });
      return;
    }

    setPaying(true);
    try {
      // Check if account exists on testnet and has balance
      console.log("Checking account...");
      const server = new Horizon.Server(getHorizonUrl());
      try {
        const account = await server.loadAccount(address);
        const balance = parseFloat(
          account.balances.find((b) => b.asset_type === "native")?.balance ||
            "0"
        );
        if (balance < 0.1) {
          // Need at least 0.1 XLM for fees
          setToast({
            message:
              "Your testnet account needs more XLM. Please visit https://faucet.stellar.org/ to fund your account.",
            type: "error",
          });
          setPaying(false);
          return;
        }
      } catch (error) {
        setToast({
          message:
            "Your testnet account needs to be funded. Please visit https://faucet.stellar.org/ to fund your account.",
          type: "error",
        });
        setPaying(false);
        return;
      }

      console.log("Calling paywall contract...");
      const signTransactionFn = async (
        xdr: string,
        opts?: {
          networkPassphrase?: string;
          address?: string;
          submit?: boolean;
          submitUrl?: string;
        }
      ) => {
        return await wallet.signTransaction(xdr, {
          address: opts?.address || address,
          networkPassphrase: opts?.networkPassphrase || networkPassphrase,
        });
      };
      const client = getPaywallClient(address);
      const tx = await client.pay_for_access({
        post_id: post.paymentRequestId,
        payer: address,
      });
      await tx.signAndSend({
        signTransaction: signTransactionFn,
      });
      console.log("Submitted");

      setToast({ message: `Payment completed successfully!`, type: "success" });

      // Reload post to show content
      await loadPost();
    } catch (error) {
      console.error("Error paying for post:", error);
      setToast({
        message: `Error completing payment: ${(error as Error).message}`,
        type: "error",
      });
    }
    setPaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Post Not Found
            </h2>
            <p className="text-sm text-gray-500">
              This post may not exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasAccess =
    post.status === "completed" || post.hasAccess || post.isCreator;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {post.title || "Paid Post"}
          </h1>
        </div>

        {/* Access Status Banner */}
        <div className="mb-6">
          {hasAccess ? (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Access Granted
                  </h3>
                  <p className="text-sm text-gray-600">
                    You can view the full content of this post
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Payment Required
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pay {post.amount} XLM to access this content
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="p-8 sm:p-12">
            {hasAccess ? (
              post.content ? (
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No content available</p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Content Locked
                </h3>
                <p className="text-gray-600 mb-8">
                  This content requires payment to access
                </p>

                {/* Payment Details */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200 mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2 text-center">
                      Amount Required
                    </p>
                    <p className="text-4xl font-bold text-gray-900 text-center">
                      {post.amount}
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-1">
                      XLM
                    </p>
                  </div>

                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600">
                        Recipient
                      </span>
                      <span className="text-sm font-mono text-gray-900">
                        {post.destination.slice(0, 8)}...
                        {post.destination.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={payForPost}
                    disabled={paying || !address}
                    className="w-full max-w-md py-4 px-8 bg-gray-900 text-white font-semibold rounded-xl shadow-sm hover:bg-gray-800 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 cursor-pointer flex items-center justify-center gap-3"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="animate-spin h-6 w-6" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {post.amount} XLM to Unlock</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
                {/* Warning */}
                <div className="max-w-md mx-auto mt-6">
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 mb-1">
                        Secure Payment
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        This payment is processed securely on the Stellar
                        blockchain. Funds will be sent directly to the content
                        creator.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Post Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Post Information
                </p>
                <p className="text-xs text-gray-500">
                  Created{" "}
                  {new Date(post.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                Post ID: {post.paymentRequestId || postId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
