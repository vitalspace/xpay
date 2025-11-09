import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { AlertCircle, ArrowRight, CheckCircle2, CreditCard, Info, Loader2, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Toast } from "../components/ui/Toast";
import { networkPassphrase } from "../contracts/util";
import { useWallet } from "../hooks/useWallet";
import { paymentService } from "../services/api";
import { wallet } from "../util/wallet";

// This component is now only for payment requests (not posts)
// Posts are handled by PostView component

export const PayRequest: React.FC = () => {
  const { paymentRequestId } = useParams<{ paymentRequestId: string }>();
  const { address } = useWallet();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<{
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
    needsPayment?: boolean;
  } | null>(null);

  useEffect(() => {
    if (paymentRequestId) {
      loadPaymentRequest();
    }
  }, [paymentRequestId]);

  const loadPaymentRequest = async () => {
    try {
      const data = await paymentService.getPaymentRequest(paymentRequestId!, address);
      setPaymentRequest(data);
    } catch (error) {
      console.error("Error loading payment request:", error);
      setToast({ message: "Payment request not found or expired", type: 'error' });
    }
    setLoading(false);
  };

  const getHorizonUrl = () => {
    return "https://horizon-testnet.stellar.org";
  };

  const payRequest = async () => {
    if (!address || !paymentRequest) {
      setToast({ message: "Please connect your wallet first", type: 'error' });
      return;
    }

    if (paymentRequest.status !== "pending") {
      setToast({ message: "This payment request has already been completed", type: 'error' });
      return;
    }

    setPaying(true);
    try {
      console.log("Building payment transaction...");
      const server = new Horizon.Server(getHorizonUrl());
      const sourceAccount = await server.loadAccount(address);
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: paymentRequest.destination,
            asset: Asset.native(),
            amount: paymentRequest.amount,
          })
        )
        .addMemo(Memo.text((paymentRequest.memo || `Payment for request ${paymentRequest.paymentRequestId}`).slice(0, 28)))
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

      // Complete the payment request
      await paymentService.completePaymentRequest({
        paymentRequestId: paymentRequest.paymentRequestId,
        transactionHash: result.hash,
        payerAddress: address,
      });

      const shortHash = `${result.hash.slice(0, 6)}...${result.hash.slice(-4)}`;
      setToast({ message: `Payment completed successfully! Transaction hash: ${shortHash}`, type: 'success' });

      // Reload payment request to show updated status
      await loadPaymentRequest();
    } catch (error) {
      console.error("Error paying request:", error);
      setToast({ message: `Error completing payment: ${(error as Error).message}`, type: 'error' });
    }
    setPaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading payment request...</p>
        </div>
      </div>
    );
  }

  if (!paymentRequest) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Request Not Found</h2>
            <p className="text-sm text-gray-500">This payment request may have expired or been completed.</p>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = paymentRequest.status === "completed";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {paymentRequest.title ? "Paid Post" : "Payment Request"}
          </h1>
          <p className="text-sm text-gray-500">
            {paymentRequest.title ? "Pay to access this content" : "Review and complete this payment"}
          </p>
        </div>

        {/* Connected Wallet Banner */}
        {address && (
          <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center ">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">
                  Connected Wallet
                </p>
                <p className="text-xs font-mono text-gray-500 truncate">
                  {address}
                </p>
              </div>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1.5 ">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Connected
              </span>
            </div>
          </div>
        )}

        {/* Status Banner */}
        <div className="mb-6">
          {isCompleted ? (
            <div className="bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Payment Completed</h3>
                  <p className="text-sm text-gray-600">This payment request has been successfully paid</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Payment Pending</h3>
                  <p className="text-sm text-gray-600">Ready to be paid</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {paymentRequest.title ? "Post Details" : "Payment Details"}
            </h2>
            <p className="text-sm text-gray-500">
              {paymentRequest.title ? "Review the post and payment information" : "Review the payment information"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-4">
            {/* Payment requests don't have content - they're just payment requests */}
            {paymentRequest.memo && (
              <div className="p-4 bg-gray-50 rounded-xl mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                <p className="text-sm text-gray-900">{paymentRequest.memo}</p>
              </div>
            )}

            {/* Amount - Prominent Display */}
            <div className="p-6 bg-linear-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-2 text-center">Amount Due</p>
              <p className="text-4xl font-bold text-gray-900 text-center">{paymentRequest.amount}</p>
              <p className="text-sm text-gray-500 text-center mt-1">XLM</p>
            </div>

            {/* Other Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Recipient</span>
                <span className="text-sm font-mono text-gray-900 text-right break-all max-w-[60%]">
                  {paymentRequest.destination.slice(0, 12)}...{paymentRequest.destination.slice(-12)}
                </span>
              </div>

              {paymentRequest.memo && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{paymentRequest.memo}</p>
                </div>
              )}

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(paymentRequest.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  isCompleted 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <Shield className="w-5 h-5 text-blue-600  mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Secure Transaction
                </p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  This payment is processed on the Stellar blockchain. Always verify the recipient address before confirming.
                </p>
              </div>
            </div>

            {/* Pay Button - Only show if not creator and doesn't have access */}
            {!isCompleted && !paymentRequest.isCreator && !paymentRequest.hasAccess && (
              <button
                type="button"
                onClick={payRequest}
                disabled={paying || !address}
                className="w-full py-3 px-6 bg-gray-900 text-white font-semibold rounded-xl shadow-sm hover:bg-gray-800 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 cursor-pointer flex items-center justify-center gap-2 mt-6"
              >
                {paying ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {paymentRequest.amount} XLM</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}

            {/* Warning Message - Only show if payment button is visible */}
            {!isCompleted && !paymentRequest.isCreator && !paymentRequest.hasAccess && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600  mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Important Notice
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Blockchain transactions are irreversible. Please double-check all details before confirming the payment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Network Info Footer */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Network</p>
                <p className="text-xs text-gray-500">All transactions on testnet</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl border border-blue-200 inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Stellar Testnet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
