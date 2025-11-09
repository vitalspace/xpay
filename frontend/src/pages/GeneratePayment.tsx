import { CreditCard, Info, Loader2, QrCode, Share2, Copy, Check, AlertCircle, Download } from "lucide-react";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { z } from "zod";
import { Toast } from "../components/ui/Toast";
import { useWallet } from "../hooks/useWallet";
import { paymentService } from "../services/api";

// Validation schema
const paymentRequestSchema = z.object({
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number")
    .refine((val) => Number(val) <= 1000, "Amount cannot exceed 1000 XLM"),
  destination: z.string()
    .min(1, "Recipient address is required")
    .regex(/^G[A-Z0-9]{55}$/, "Invalid Stellar public key format")
    .optional(),
  memo: z.string()
    .max(28, "Memo cannot exceed 28 characters")
    .optional(),
});

type PaymentRequestForm = z.infer<typeof paymentRequestSchema>;

export const GeneratePayment: React.FC = () => {
  const { address } = useWallet();
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentRequestForm, string>>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatedRequest, setGeneratedRequest] = useState<{
    paymentRequestId: string;
    amount: string;
    asset: string;
    destination: string;
    memo?: string;
    status: string;
    createdAt: string;
  } | null>(null);

  const validateForm = (): boolean => {
    try {
      paymentRequestSchema.parse({ amount, destination: destination || undefined, memo });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof PaymentRequestForm, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof PaymentRequestForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const generatePaymentRequest = async () => {
    if (!address) {
      setToast({ message: "Please connect your wallet first", type: 'error' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await paymentService.createPaymentRequest({
        userId: address,
        amount,
        asset: "XLM",
        destination: destination || address,
        memo: memo || undefined,
      });

      setGeneratedRequest(result);
      setToast({ message: "Payment request generated successfully!", type: 'success' });

      // Clear form
      setAmount("");
      setDestination("");
      setMemo("");
    } catch (error) {
      console.error("Error generating payment request:", error);
      setToast({ message: `Error generating payment request: ${(error as Error).message}`, type: 'error' });
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setToast({ message: "Copied to clipboard!", type: 'success' });
    } catch (error) {
      setToast({ message: "Failed to copy to clipboard", type: 'error' });
    }
  };

  const shareableLink = generatedRequest
    ? `${window.location.origin}/pay/${generatedRequest.paymentRequestId}`
    : "";

  const qrData = generatedRequest ? shareableLink : "";

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

      <div className="container mx-auto max-w-6xl">
        {/* Header with XPay branding */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Receive XLM
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 ml-15">
            Generate a payment request with QR code to receive XLM instantly
          </p>
        </div>

        {/* Connected Wallet Banner */}
        {address && (
          <div className="mb-6 bg-white border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-100/50">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
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
          {/* Payment Request Form */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            {/* Form Header */}
            <div className="p-6 sm:p-8 border-b-2 border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    Request Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    Set up your payment request information
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Amount Field */}
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
                  Amount <span className="text-red-500">*</span>
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
                        setErrors(prev => ({ ...prev, amount: undefined }));
                      }
                    }}
                    step="0.01"
                    min="0"
                    disabled={loading}
                    className={`w-full px-4 py-3 pr-16 bg-white border-2 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.amount
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
                    <span className="text-sm font-semibold text-emerald-700">XLM</span>
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
                <label htmlFor="destination" className="block text-sm font-semibold text-gray-900 mb-2">
                  Recipient Address{" "}
                  <span className="text-gray-500 font-normal text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="destination"
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (errors.destination) {
                      setErrors(prev => ({ ...prev, destination: undefined }));
                    }
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 font-mono text-xs placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.destination
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-100'
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

              {/* Description/Memo Field */}
              <div>
                <label htmlFor="memo" className="block text-sm font-semibold text-gray-900 mb-2">
                  Description{" "}
                  <span className="text-gray-500 font-normal text-xs">(Optional)</span>
                </label>
                <textarea
                  id="memo"
                  placeholder="Add a note or description..."
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
                      : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-100'
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

              {/* Generate Button */}
              <button
                type="button"
                onClick={generatePaymentRequest}
                disabled={loading || !address || !amount}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Generating QR...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    <span>Generate Payment Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Preview / Generated Request */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-xl">
            {!generatedRequest ? (
              <>
                <div className="p-6 sm:p-8 border-b-2 border-gray-200 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">
                        QR Code Preview
                      </h2>
                      <p className="text-sm text-gray-500">
                        Your payment QR will appear here
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-300 rounded-2xl flex items-center justify-center mb-4">
                      <QrCode className="w-20 h-20 text-emerald-300" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Generate a payment request to see the QR code
                    </p>
                    <p className="text-xs text-gray-400">
                      Share with anyone to receive XLM
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success Header */}
                <div className="p-6 sm:p-8 border-b-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">
                        Request Generated!
                      </h2>
                      <p className="text-sm text-gray-600">
                        Share this QR code or link to receive payment
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* QR Code Display */}
                  <div className="flex items-center justify-center">
                    <div className="p-6 bg-white border-2 border-emerald-200 rounded-2xl shadow-lg">
                      <QRCode
                        value={qrData}
                        size={200}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                      <span className="text-sm font-medium text-gray-600">Amount</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {generatedRequest.amount} XLM
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full capitalize border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        {generatedRequest.status}
                      </span>
                    </div>
                    {generatedRequest.memo && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-sm font-medium text-gray-600 block mb-1">
                          Description
                        </span>
                        <span className="text-sm text-gray-900">
                          {generatedRequest.memo}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Shareable Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Payment Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareableLink}
                        readOnly
                        className="flex-1 px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm font-mono text-gray-700"
                      />
                      <button
                        onClick={() => copyToClipboard(shareableLink)}
                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                      >
                        {copiedLink ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Payment Request - XPay',
                          text: `Pay ${generatedRequest.amount} XLM`,
                          url: shareableLink,
                        });
                      } else {
                        copyToClipboard(shareableLink);
                      }
                    }}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Payment Request</span>
                  </button>

                  <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-sm text-emerald-900 font-medium mb-1">
                      💳 Ready to Receive
                    </p>
                    <p className="text-xs text-emerald-700">
                      Anyone can scan this QR or use the link to pay you
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
