import axios, { AxiosInstance, AxiosResponse } from "axios";

// Base API configuration

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      // Could redirect to login page here
    }
    return Promise.reject(error);
  },
);

// API endpoints
export const userService = {
  createUser: async (userData: { address: string }) => {
    const response = await api.post("/create-user", userData);
    return response.data;
  },

  getUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (
    userId: string,
    userData: Partial<{ name: string; email: string }>,
  ) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  updateUserProfile: async (userData: {
    address: string;
    username?: string;
    email?: string;
    avatar?: string;
    banner?: string;
    bio?: string;
  }) => {
    const response = await api.put("/update-user", userData);
    return response.data;
  },

  getUserProfile: async (address: string) => {
    const response = await api.post("/profile", { address });
    return response.data;
  },
};

export const paymentService = {
  createPayment: async (paymentData: {
    userId: string;
    amount: string;
    asset: string;
    destination: string;
    transactionHash: string;
    memo?: string;
    status?: "pending" | "completed" | "failed";
  }) => {
    const response = await api.post("/create-payment", paymentData);
    return response.data;
  },

  getPaymentsByUser: async (userId: string) => {
    const response = await api.post("/payments-by-user", { userId });
    return response.data;
  },

  updatePaymentStatus: async (
    transactionHash: string,
    status: "pending" | "completed" | "failed",
  ) => {
    const response = await api.put("/update-payment-status", {
      transactionHash,
      status,
    });
    return response.data;
  },

  createPaymentRequest: async (paymentRequestData: {
    userId: string;
    amount: string;
    asset: string;
    destination: string;
    memo?: string;
  }) => {
    const response = await api.post(
      "/create-payment-request",
      paymentRequestData,
    );
    return response.data;
  },

  createPost: async (postData: {
    userId: string;
    title: string;
    content: string;
    amount: string;
    destination: string;
  }) => {
    const response = await api.post("/create-post", postData);
    return response.data;
  },

  getPost: async (postId: string, userAddress?: string) => {
    const headers = userAddress ? { "x-user-address": userAddress } : {};
    const response = await api.get(`/post/${postId}`, {
      headers,
      validateStatus: (status) => status === 200 || status === 402,
    });

    if (response.status === 402) {
      // Payment required
      const data = response.data;
      return {
        paymentRequestId: postId,
        amount: data.paymentDetails.amount,
        asset: data.paymentDetails.asset,
        destination: data.paymentDetails.destination,
        memo: undefined,
        status: "pending",
        createdAt: new Date().toISOString(),
        userAddress: "",
        title: data.paymentDetails.title,
        content: undefined, // Content not available until payment
        hasAccess: false,
      };
    } else {
      // Has access or is creator
      return response.data;
    }
  },

  completePostPayment: async (data: {
    postId: string;
    transactionHash: string;
    payerAddress: string;
  }) => {
    const response = await api.post("/complete-post-payment", data);
    return response.data;
  },

  getPaymentRequest: async (paymentRequestId: string, userAddress?: string) => {
    const headers = userAddress ? { "x-user-address": userAddress } : {};
    const response = await api.get(`/payment-request/${paymentRequestId}`, {
      headers,
    });
    return response.data;
  },

  completePaymentRequest: async (data: {
    paymentRequestId: string;
    transactionHash: string;
    payerAddress: string;
  }) => {
    const response = await api.post("/complete-payment-request", data);
    return response.data;
  },

  getAnalytics: async (userAddress: string) => {
    const response = await api.post("/analytics", { userAddress });
    return response.data;
  },
};

// Generic API methods
export const apiService = {
  get: <T = any>(url: string, params?: any): Promise<T> => {
    return api.get(url, { params }).then((res) => res.data);
  },

  post: <T = any>(url: string, data?: any): Promise<T> => {
    return api.post(url, data).then((res) => res.data);
  },

  put: <T = any>(url: string, data?: any): Promise<T> => {
    return api.put(url, data).then((res) => res.data);
  },

  delete: <T = any>(url: string): Promise<T> => {
    return api.delete(url).then((res) => res.data);
  },
};

export default api;
