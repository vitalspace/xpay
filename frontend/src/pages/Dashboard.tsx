import React, { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { paymentService, userService } from "../services/api";
import { Toast } from "../components/ui/Toast";
import {
  User,
  History,
  BarChart3,
  Copy,
  Check,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sparkles,
  Receipt,
  Link2
} from "lucide-react";

interface Payment {
  id: string;
  amount: string;
  asset: string;
  destination: string;
  transactionHash?: string;
  memo?: string;
  status: "pending" | "completed" | "failed" | "active";
  paymentRequestId?: string;
  isPaymentRequest: boolean;
  title?: string;
  content?: string;
  isPost?: boolean;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState("profile");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    banner: ""
  });

  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadPayments();
      loadUserProfile();
      loadAnalytics();
    }
  }, [address]);

  const loadPayments = async () => {
    try {
      const data = await paymentService.getPaymentsByUser(address!);
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error loading payments:", error);
    }
    setLoading(false);
  };

  const loadUserProfile = async () => {
    try {
      const user = await userService.getUserProfile(address!);
      setProfileData({
        name: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        banner: user.banner || ""
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadAnalytics = async () => {
    if (!address) return;

    setAnalyticsLoading(true);
    try {
      const data = await paymentService.getAnalytics(address);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
    setAnalyticsLoading(false);
  };

  const saveProfile = async () => {
    if (!address) return;

    setSaving(true);
    try {
      await userService.updateUserProfile({
        address,
        username: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
        banner: profileData.banner,
        bio: profileData.bio
      });
      setToast({ message: "Profile updated successfully!", type: 'success' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setToast({ message: "Failed to update profile. Please try again.", type: 'error' });
    }
    setSaving(false);
  };

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const copyPaymentLink = async (paymentRequestId: string, isPost?: boolean) => {
    const link = `${window.location.origin}${isPost ? '/post' : '/pay'}/${paymentRequestId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(paymentRequestId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-rose-600" />;
      case 'active': return <Sparkles className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const totalReceived = payments
    .filter(p => p.isPaymentRequest && p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const totalSent = payments
    .filter(p => !p.isPaymentRequest && p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const pendingRequests = payments.filter(p => p.isPaymentRequest && p.status === 'pending').length;

  const activePayments = payments.filter(p => p.isPaymentRequest && (p.status === 'pending' || p.status === 'active'));

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Connect Your Wallet</h2>
          <p className="text-sm text-gray-500 max-w-sm">Please connect your wallet to access your dashboard and manage payments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">Manage your payments and profile settings</p>
        </div>

        {/* Stats Overview - Always Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div key="total-received" className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <ArrowDownRight className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Received</p>
            <p className="text-2xl font-bold text-gray-900">{totalReceived.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">XLM</p>
          </div>

          <div key="total-sent" className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <ArrowUpRight className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">-5%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Sent</p>
            <p className="text-2xl font-bold text-gray-900">{totalSent.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">XLM</p>
          </div>

          <div key="pending-requests" className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-200 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
            <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border border-gray-200 rounded-2xl mb-6 p-1 inline-flex gap-1">
          <button
            key="profile-tab"
            onClick={() => setActiveTab("profile")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "profile"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            key="active-tab"
            onClick={() => setActiveTab("active")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "active"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Receipt className="h-4 w-4" />
            Active Payments
          </button>
          <button
            key="history-tab"
            onClick={() => setActiveTab("history")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <History className="h-4 w-4" />
            Activity
          </button>
          <button
            key="analytics-tab"
            onClick={() => setActiveTab("analytics")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Insights
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* Banner */}
            <div className="relative h-40 sm:h-48">
              {profileData.banner ? (
                <img
                  src={profileData.banner}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Avatar & Quick Info */}
            <div className="px-6 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 relative z-10">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 mt-2 sm:mt-0 sm:mb-2">
                  <h2 className="text-xl font-bold text-white">{profileData.name || "Anonymous User"}</h2>
                  <p className="text-sm text-gray-500">{profileData.email || "No email set"}</p>
                  {profileData.bio && (
                    <p className="text-sm text-gray-600 mt-1">{profileData.bio}</p>
                  )}
                </div>
              </div>

              {/* Wallet Address */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Wallet Address
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono text-gray-900 truncate">
                    {address}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="cursor-pointer flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your username"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={profileData.avatar}
                      onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner URL
                    </label>
                    <input
                      type="url"
                      value={profileData.banner}
                      onChange={(e) => setProfileData(prev => ({ ...prev, banner: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="cursor-pointer px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={loadUserProfile}
                    className="cursor-pointer px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Payments Tab */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto" />
              </div>
            ) : activePayments.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Receipt className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No active payment requests</p>
                <p className="text-xs text-gray-500">Create a payment request to get started</p>
              </div>
            ) : (
              activePayments.map((payment, index) => (
                <div key={`active-${payment.id || index}`} className={`bg-gradient-to-br ${payment.isPost ? 'from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300' : 'from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300'} rounded-2xl p-6 transition-all`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${payment.isPost ? 'bg-blue-100' : 'bg-amber-100'} rounded-xl flex items-center justify-center`}>
                        {payment.isPost ? (
                          <Receipt className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {payment.isPost ? 'Protected Post' : 'Pending Payment Request'}
                        </p>
                        <p className="text-xs text-gray-600">Created {formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{payment.amount}</p>
                      <p className="text-xs text-gray-600">{payment.asset}</p>
                    </div>
                  </div>

                  {payment.title && (
                    <div className="mb-4 p-3 bg-white/60 rounded-lg border border-current">
                      <p className="text-xs text-gray-600 mb-1">Title</p>
                      <p className="text-sm text-gray-900 font-medium">{payment.title}</p>
                    </div>
                  )}

                  {payment.memo && !payment.isPost && (
                    <div className="mb-4 p-3 bg-white/60 rounded-lg border border-current">
                      <p className="text-xs text-gray-600 mb-1">Description</p>
                      <p className="text-sm text-gray-900">{payment.memo}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-current">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Link2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <code className="text-xs font-mono text-gray-700 truncate">
                          {payment.isPost ? `/post/${payment.paymentRequestId}` : `/pay/${payment.paymentRequestId}`}
                        </code>
                      </div>
                      <button
                        onClick={() => copyPaymentLink(payment.paymentRequestId!, payment.isPost)}
                        className={`cursor-pointer flex-shrink-0 ml-2 p-2 rounded-lg transition-colors ${payment.isPost ? 'hover:bg-blue-100' : 'hover:bg-amber-100'}`}
                      >
                        {copiedLink === payment.paymentRequestId ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    <a
                      href={payment.isPost ? `/post/${payment.paymentRequestId}` : `/pay/${payment.paymentRequestId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-medium"
                    >
                      {payment.isPost ? 'View Post' : 'View Payment Page'}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto" />
              </div>
            ) : payments.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <History className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No payment activity yet</p>
              </div>
            ) : (
              payments.map((payment, index) => (
                <div key={`history-${payment.id || index}`} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.isPost ? 'Protected Post Created' : payment.isPaymentRequest ? 'Payment Request' : 'Payment Sent'}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{payment.amount} {payment.asset}</p>
                    </div>
                  </div>

                  {payment.title && (
                    <p className="text-sm text-gray-600 mb-2 bg-blue-50 p-3 rounded-lg font-medium">
                      {payment.title}
                    </p>
                  )}

                  {payment.memo && !payment.isPost && (
                    <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                      {payment.memo}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-500">To:</span>
                    <code className="px-2 py-1 bg-gray-100 rounded font-mono text-gray-700">
                      {payment.destination.slice(0, 8)}...{payment.destination.slice(-8)}
                    </code>
                    {payment.transactionHash && (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${payment.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {payment.isPost && (
                      <a
                        href={`/post/${payment.paymentRequestId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                      >
                        View Post
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "analytics" && (
           <div className="space-y-4">
             <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
               <div className="flex items-start gap-3 mb-4">
                 <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                   <Sparkles className="h-5 w-5" />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-semibold text-lg mb-1">AI-Powered Insights</h3>
                   <p className="text-sm text-white/80">Smart analytics for your payment patterns</p>
                 </div>
               </div>
             </div>

             {analyticsLoading ? (
               <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                 <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-3" />
                 <p className="text-sm text-gray-600">Generating insights...</p>
               </div>
             ) : analytics ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div key="payment-patterns" className="bg-white border border-gray-200 rounded-2xl p-6">
                   <div className="flex items-start gap-3">
                     <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                       <TrendingUp className="h-5 w-5 text-blue-600" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 mb-2">Payment Patterns</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">
                         {analytics.paymentPatterns || "Analyzing your payment patterns..."}
                       </p>
                     </div>
                   </div>
                 </div>

                 <div key="success-rate" className="bg-white border border-gray-200 rounded-2xl p-6">
                   <div className="flex items-start gap-3">
                     <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                       <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">
                         {analytics.successRate || "Calculating success metrics..."}
                       </p>
                     </div>
                   </div>
                 </div>

                 <div key="active-days" className="bg-white border border-gray-200 rounded-2xl p-6">
                   <div className="flex items-start gap-3">
                     <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                       <Clock className="h-5 w-5 text-amber-600" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 mb-2">Active Days</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">
                         {analytics.activeDays || "Identifying your most active periods..."}
                       </p>
                     </div>
                   </div>
                 </div>

                 <div key="income-expenses" className="bg-white border border-gray-200 rounded-2xl p-6">
                   <div className="flex items-start gap-3">
                     <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                       <BarChart3 className="h-5 w-5 text-purple-600" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 mb-2">Income vs Expenses</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">
                         {analytics.incomeVsExpenses || "Analyzing financial flow..."}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                 <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                   <BarChart3 className="h-6 w-6 text-gray-400" />
                 </div>
                 <p className="text-sm font-medium text-gray-900 mb-1">No analytics available</p>
                 <p className="text-xs text-gray-500">Complete some payments to see AI insights</p>
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
};
