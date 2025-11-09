import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { AlertCircle, CreditCard, Info, Loader2, Send, ArrowRight, Zap } from "lucide-react";
import React, { useState } from "react";
import { z } from "zod";
import { Toast } from "../components/ui/Toast";
import { networkPassphrase } from "../contracts/util";
import { useWallet } from "../hooks/useWallet";
import { wallet } from "../util/wallet";
import { paymentService } from "../services/api";

// Validation schema
const paymentSchema = z.object({
  toPublicKey: z.string()
    .min(1, "Recipient address is required")
    .regex(/^G[A-Z0-9]{55}$/, "Invalid Stellar public key format"),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number")
    .refine((val) => Number(val) <= 1000, "Amount cannot exceed 1000 XLM"),
  memo: z.string()
    .max(28, "Memo cannot exceed 28 characters")
    .optional(),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export const SendPayment: React.FC = () => {
  const { address } = useWallet();
  const [toPublicKey, setToPublicKey] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentForm, string>>>({});

  const getHorizonUrl = () => {
    return "https://horizon-testnet.stellar.org";
  };

  const validateForm = (): boolean => {
    try {
      paymentSchema.parse({ toPublicKey, amount, memo });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof PaymentForm, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof PaymentForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const sendPayment = async () => {
    if (!address) {
      setToast({ message: "Please connect your wallet first", type: 'error' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log("Building transaction...");
      const server = new Horizon.Server(getHorizonUrl());
      const sourceAccount = await server.loadAccount(address);
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: toPublicKey,
            asset: Asset.native(),
            amount: amount,
          })
        )
        .addMemo(Memo.text(memo || "Payment"))
        .setTimeout(180)
        .build();

      const xdr = transaction.toXDR();
      console.log("Transaction built, signing...");

      const { signedTxXdr } = await wallet.signTransaction(xdr, {
        address,
        networkPassphrase,
      });

      console.log("Signed, submitting...");
      const signedTransaction = TransactionBuilder.fromXDR(
        signedTxXdr,
        networkPassphrase
      );
      const result = await server.submitTransaction(signedTransaction);
      console.log("Submitted:", result.hash);

      // Save payment to backend
      try {
        await paymentService.createPayment({
          userId: address,
          amount,
          asset: "XLM",
          destination: toPublicKey,
          transactionHash: result.hash,
          memo: memo || undefined,
          status: "completed",
        });
        console.log("Payment saved to backend");
      } catch (backendError) {
        console.error("Error saving payment to backend:", backendError);
      }

      const shortHash = `${result.hash.slice(0, 6)}...${result.hash.slice(-4)}`;
      setToast({ message: `Payment sent successfully! Transaction hash: ${shortHash}`, type: 'success' });

      // Clear form
      setToPublicKey("");
      setAmount("");
      setMemo("");
    } catch (error) {
      console.error("Error:", error);
      setToast({ message: `Error sending payment: ${(error as Error).message}`, type: 'error' });
    }
    setLoading(false);
  };

  const quickAmounts = [1, 5, 10, 25, 50, 100];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto max-w-2xl">
        {/* Header with XPay branding */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Send XLM
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 ml-15">
            Transfer Lumens instantly on the Stellar network with XPay
          </p>
        </div>

        {/* Connected Wallet Banner */}
        {address && (
          <div className="mb-6 bg-white border-2 border-blue-200 rounded-2xl p-4 sm:p-5 shadow-lg shadow-blue-100/50">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
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

        {/* Payment Form */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl">
          {/* Form Header */}
          <div className="p-6 sm:p-8 border-b-2 border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Payment Details
                </h2>
                <p className="text-sm text-gray-600">
                  Lightning-fast P2P transfers on Stellar
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Recipient Address */}
            <div>
              <label htmlFor="recipient-address" className="block text-sm font-semibold text-gray-900 mb-2">
                Recipient Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recipient-address"
                placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={toPublicKey}
                onChange={(e) => {
                  setToPublicKey(e.target.value);
                  if (errors.toPublicKey) {
                    setErrors(prev => ({ ...prev, toPublicKey: undefined }));
                  }
                }}
                disabled={loading}
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 font-mono text-xs placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.toPublicKey
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.toPublicKey && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.toPublicKey}
                </p>
              )}
            </div>

            {/* Amount Section */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-3">
                Amount <span className="text-red-500">*</span>
              </label>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    disabled={loading}
                    className={`px-3 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                      amount === amt.toString()
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  placeholder="Or enter custom amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) {
                      setErrors(prev => ({ ...prev, amount: undefined }));
                    }
                  }}
                  step="0.01"
                  min="0"
                  disabled={loading}
                  className={`w-full px-4 py-3 pr-16 bg-white border-2 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.amount
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-200">
                  <span className="text-sm font-semibold text-blue-700">XLM</span>
                </div>
              </div>
              {errors.amount && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Memo Field */}
            <div>
              <label htmlFor="memo" className="block text-sm font-semibold text-gray-900 mb-2">
                Memo{" "}
                <span className="text-gray-500 font-normal text-xs">(Optional)</span>
              </label>
              <textarea
                id="memo"
                placeholder="Add a note (e.g., Invoice #123)"
                value={memo}
                onChange={(e) => {
                  setMemo(e.target.value);
                  if (errors.memo) {
                    setErrors(prev => ({ ...prev, memo: undefined }));
                  }
                }}
                rows={3}
                disabled={loading}
                maxLength={28}
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.memo
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.memo ? (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.memo}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Max 28 characters
                  </p>
                )}
                <span className={`text-xs font-semibold ${
                  memo.length > 24 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {memo.length}/28
                </span>
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">
                  Transaction Confirmation Required
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Double-check the recipient address. Blockchain transactions are irreversible and cannot be canceled once confirmed.
                </p>
              </div>
            </div>

            {/* Send Payment Button */}
            <button
              type="button"
              onClick={sendPayment}
              disabled={loading || !address || !toPublicKey || !amount}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Payment</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Transaction Speed Info */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Typically settles in 3-5 seconds</span>
            </div>
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
                <p className="text-sm font-semibold text-gray-900">XPay Network</p>
                <p className="text-xs text-gray-500">Stellar P2P Payments • Testnet</p>
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
