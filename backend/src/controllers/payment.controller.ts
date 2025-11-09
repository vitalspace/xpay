import { Context } from "elysia";
import Payment from "../models/payment.model.js";
import { IPayment } from "../types/";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const createPayment = async (ctx: Context) => {
  try {
    const {
      userId,
      amount,
      asset,
      destination,
      transactionHash,
      memo,
      status,
    } = ctx.body as IPayment & { userId: string };

    // First, find the user by address to get the ObjectId
    const user = await User.findOne({ address: userId });
    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    const existingPayment = await Payment.findOne({ transactionHash });
    if (existingPayment) {
      ctx.set.status = 400;
      return { message: "Payment already exists" };
    }

    // Generate unique ID using Bun.randomUUIDv7
    const { randomUUIDv7 } = await import("bun");
    const uniqueId = randomUUIDv7();

    const newPayment = new Payment({
      id: uniqueId,
      userId: user._id,
      amount,
      asset,
      destination,
      transactionHash,
      memo,
      status: status || "pending",
    });

    const savedPayment = await newPayment.save();

    ctx.set.status = 201;
    return JSON.stringify(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const getPaymentsByUser = async (ctx: Context) => {
  try {
    const { userId } = ctx.body as { userId: string };

    // Find user by address to get ObjectId
    const user = await User.findOne({ address: userId });
    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    // Get payments (including payment requests)
    const payments = await Payment.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    // Get posts created by the user
    const posts = await Post.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    // Convert posts to payment-like format for frontend compatibility
    const postsAsPayments = posts.map(post => ({
      id: post.id,
      amount: post.amount,
      asset: post.asset,
      destination: post.destination,
      memo: post.content, // Use content as memo for display
      status: "active" as const, // Posts are always "active"
      paymentRequestId: post.postId,
      isPaymentRequest: true, // Treat posts as payment requests
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      isPost: true, // Flag to identify posts
    }));

    // Combine payments and posts
    const allItems = [...payments, ...postsAsPayments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    ctx.set.status = 200;
    return JSON.stringify({ payments: allItems });
  } catch (error) {
    console.error("Error getting payments:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const updatePaymentStatus = async (ctx: Context) => {
  try {
    const { transactionHash, status } = ctx.body as {
      transactionHash: string;
      status: "pending" | "completed" | "failed";
    };

    const payment = await Payment.findOneAndUpdate(
      { transactionHash },
      { status },
      { new: true }
    );

    if (!payment) {
      ctx.set.status = 404;
      return { message: "Payment not found" };
    }

    ctx.set.status = 200;
    return JSON.stringify(payment);
  } catch (error) {
    ctx.set.status = 500;
    return { message: "internal server error" };
  }
};


// Obtener un post con verificación X402
export const getPaymentRequest = async (ctx: Context) => {
  try {
    const { paymentRequestId } = ctx.params as { paymentRequestId: string };
    const userAddress = ctx.headers["x-user-address"] as string | undefined;

    // Try to find as payment request first
    let paymentRequest = await Payment.findOne({
      paymentRequestId,
      isPaymentRequest: true,
    }).populate("userId", "address");

    // If not found, try to find as post
    if (!paymentRequest) {
      paymentRequest = await Payment.findOne({
        postId: paymentRequestId,
        isPost: true,
      }).populate("userId", "address");
    }

    if (!paymentRequest) {
      ctx.set.status = 404;
      return { message: "Payment request or post not found" };
    }

    // Type assertion since we've checked for null above
    const request = paymentRequest!;

    // Verificar si el usuario es el creador
    const isCreator = userAddress ? (request.userId as any).address === userAddress : false;

    // Para posts, verificar acceso incluso para el creador (por consistencia)
    if (request.isPost && !isCreator && userAddress) {
      // No tiene acceso - devolver payment details
      ctx.set.status = 200;
      return {
        paymentRequestId: request.paymentRequestId || request.postId,
        title: request.title,
        amount: request.amount,
        asset: request.asset || "XLM",
        destination: request.destination,
        status: request.status,
        createdAt: request.createdAt,
        userAddress: (request.userId as any).address,
        hasAccess: false,
        isCreator: false,
        needsPayment: true,
      };
    }

    // Para payment requests (no posts), verificar acceso si es necesario
    if (!request.isPost && userAddress) {
      // No tiene acceso - devolver payment details
      ctx.set.status = 200;
      return {
        paymentRequestId: request.paymentRequestId || request.postId,
        title: request.title,
        amount: request.amount,
        asset: request.asset || "XLM",
        destination: request.destination,
        status: request.status,
        createdAt: request.createdAt,
        userAddress: (request.userId as any).address,
        hasAccess: false,
        isCreator: false,
        needsPayment: true,
      };
    }

    // Usuario tiene acceso (creador o pagó) - devolver contenido completo
    ctx.set.status = 200;
    return {
      paymentRequestId: request.paymentRequestId || request.postId,
      title: request.title,
      amount: request.amount,
      asset: request.asset || "XLM",
      destination: request.destination,
      content: request.content,
      status: request.status,
      createdAt: request.createdAt,
      userAddress: (request.userId as any).address,
      hasAccess: true,
      isCreator,
    };

  } catch (error) {
    console.error("Error getting payment request:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Crear payment request (para casos sin contenido protegido)
export const createPaymentRequest = async (ctx: Context) => {
  try {
    const {
      userId,
      amount,
      asset,
      destination,
      memo,
    } = ctx.body as {
      userId: string;
      amount: string;
      asset: string;
      destination: string;
      memo?: string;
    };

    // Find the user by address
    let user = await User.findOne({ address: userId });
    if (!user) {
      user = new User({ address: userId });
      await user.save();
    }

    // Generate unique payment request ID
    const paymentRequestId = `pr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate unique ID using Bun.randomUUIDv7
    const { randomUUIDv7 } = await import("bun");
    const uniqueId = randomUUIDv7();

    const newPaymentRequest = new Payment({
      id: uniqueId,
      userId: user._id,
      amount,
      asset: asset || "native",
      destination,
      memo,
      status: "pending",
      paymentRequestId,
      isPaymentRequest: true,
    });

    const savedPaymentRequest = await newPaymentRequest.save();

    ctx.set.status = 201;
    return {
      paymentRequestId,
      amount,
      asset: asset || "native",
      destination,
      memo,
      status: "pending",
      createdAt: savedPaymentRequest.createdAt,
    };
  } catch (error) {
    console.error("Error creating payment request:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Verificar y completar pago
export const completePaymentRequest = async (ctx: Context) => {
  try {
    const {
      paymentRequestId,
      transactionHash,
      payerAddress,
    } = ctx.body as {
      paymentRequestId: string;
      transactionHash: string;
      payerAddress: string;
    };

    // Check if payment request exists (try both payment requests and posts)
    let paymentRequest = await Payment.findOne({
      paymentRequestId,
      isPaymentRequest: true,
    });

    if (!paymentRequest) {
      paymentRequest = await Payment.findOne({
        postId: paymentRequestId,
        isPost: true,
      });
    }

    if (!paymentRequest) {
      ctx.set.status = 404;
      return { message: "Payment request not found" };
    }

    // Check if transaction hash already exists
    const existingPayment = await Payment.findOne({ transactionHash });
    if (existingPayment) {
      const existingId = existingPayment.paymentRequestId || existingPayment.postId;
      const currentId = paymentRequest.paymentRequestId || paymentRequest.postId;
      if (existingId !== currentId) {
        ctx.set.status = 400;
        return { message: "Transaction already used for another payment" };
      }
    }

    // For now, skip blockchain verification and just mark as completed
    // TODO: Implement proper blockchain verification

    // For now, skip blockchain verification and just mark as completed
    // TODO: Implement proper blockchain verification
    console.log(`Payment completed for ${paymentRequest.isPost ? paymentRequest.postId : paymentRequestId} by ${payerAddress}`);

    // Update the payment request with transaction details
    const requestId = paymentRequest.paymentRequestId || paymentRequest.postId;
    paymentRequest.transactionHash = transactionHash;
    paymentRequest.status = "completed";
    await paymentRequest.save();

    // Create a payment record for the payer if needed
    let payerUser = await User.findOne({ address: payerAddress });
    if (!payerUser) {
      payerUser = new User({ address: payerAddress });
      await payerUser.save();
    }

    // Create payment record
    const { randomUUIDv7 } = await import("bun");
    const uniqueId = randomUUIDv7();

    const paymentRecord = new Payment({
      id: uniqueId,
      userId: payerUser._id,
      amount: paymentRequest.amount,
      asset: paymentRequest.asset,
      destination: paymentRequest.destination,
      transactionHash,
      memo: `Payment for ${requestId}`,
      status: "completed",
    });

    await paymentRecord.save();

    ctx.set.status = 200;
    return {
      message: "Payment completed successfully",
      paymentRequestId: requestId,
      transactionHash,
      hasAccess: true,
    };
  } catch (error) {
    console.error("Error completing payment request:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

