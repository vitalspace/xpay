import { Context } from "elysia";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import { stellarService } from "../services/stellar.service";

export const createPost = async (ctx: Context) => {
  try {
    const { userId, title, content, amount, destination, postId } =
      ctx.body as {
        userId: string;
        title: string;
        content: string;
        amount: string;
        destination: string;
        postId?: string;
      };

    // Find or create user
    let user = await User.findOne({ address: userId });
    if (!user) {
      user = new User({ address: userId });
      await user.save();
    }

    // Use provided postId or generate unique post ID
    const finalPostId =
      postId || `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate unique ID using Bun.randomUUIDv7
    const { randomUUIDv7 } = await import("bun");
    const uniqueId = randomUUIDv7();

    const newPost = new Post({
      id: uniqueId,
      userId: user._id,
      title,
      content,
      postId: finalPostId,
      amount,
      asset: "XLM",
      destination: destination || userId,
    });

    const savedPost = await newPost.save();

    ctx.set.status = 201;
    return {
      postId: finalPostId,
      title,
      content,
      amount,
      asset: "XLM",
      destination: destination || userId,
      createdAt: savedPost.createdAt,
      shareUrl: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/post/${finalPostId}`,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const getPost = async (ctx: Context) => {
  try {
    const { postId } = ctx.params as { postId: string };
    const userAddress = ctx.headers["x-user-address"] as string | undefined;
    // const hasAccess = await stellarService.hasAccess(postId, userAddress);

    const post = await Post.findOne({ postId }).populate("userId", "address");

    if (!post) {
      ctx.set.status = 404;
      return { message: "Post not found" };
    }

    // Check if user is the creator
    const isCreator = (post.userId as any).address === userAddress;

    if (isCreator) {
      // Creator can always see the content
      ctx.set.status = 200;
      return {
        postId: post.postId,
        title: post.title,
        content: post.content,
        amount: post.amount,
        asset: post.asset,
        destination: post.destination,
        createdAt: post.createdAt,
        userAddress: (post.userId as any).address,
        isCreator: true,
        hasAccess: true,
      };
    }

    // For non-creators, check blockchain access
    if (!userAddress) {
      ctx.set.status = 402;
      ctx.set.headers["x-payment-required"] = "true";
      ctx.set.headers["x-payment-amount"] = post.amount;
      ctx.set.headers["x-payment-asset"] = post.asset;
      ctx.set.headers["x-payment-destination"] = post.destination;
      ctx.set.headers["x-payment-network"] = "stellar";
      ctx.set.headers["x-payment-post-id"] = postId;

      return {
        message: "Payment required to access content",
        paymentDetails: {
          title: post.title,
          amount: post.amount,
          asset: post.asset,
          destination: post.destination,
          postId,
        },
      };
    }

    // Check if user has access via blockchain
    const hasAccess = await stellarService.hasAccess(postId, userAddress);

    if (!hasAccess) {
      ctx.set.status = 402;
      ctx.set.headers["x-payment-required"] = "true";
      ctx.set.headers["x-payment-amount"] = post.amount;
      ctx.set.headers["x-payment-asset"] = post.asset;
      ctx.set.headers["x-payment-destination"] = post.destination;
      ctx.set.headers["x-payment-network"] = "stellar";
      ctx.set.headers["x-payment-post-id"] = postId;

      return {
        message: "Payment required to access content",
        paymentDetails: {
          title: post.title,
          amount: post.amount,
          asset: post.asset,
          destination: post.destination,
          postId,
        },
      };
    }

    // User has access - return full content
    ctx.set.status = 200;
    return {
      postId: post.postId,
      title: post.title,
      content: post.content,
      amount: post.amount,
      asset: post.asset,
      destination: post.destination,
      createdAt: post.createdAt,
      userAddress: (post.userId as any).address,
      hasAccess: true,
      isCreator: false,
    };
  } catch (error) {
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Complete payment for a post
export const completePostPayment = async (ctx: Context) => {
  try {
    const { postId, transactionHash, payerAddress } = ctx.body as {
      postId: string;
      transactionHash: string;
      payerAddress: string;
    };

    // Check if post exists
    const post = await Post.findOne({ postId });
    if (!post) {
      ctx.set.status = 404;
      return { message: "Post not found" };
    }

    // Check if transaction hash already exists
    const existingPayment = await Payment.findOne({ transactionHash });
    if (existingPayment) {
      ctx.set.status = 400;
      return { message: "Transaction already used for another payment" };
    }

    // Verify the transaction on Stellar
    const txValid = await stellarService.verifyTransaction(transactionHash);
    if (!txValid) {
      ctx.set.status = 400;
      return { message: "Invalid or failed transaction" };
    }

    // Create payment record for the payer
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
      amount: post.amount,
      asset: post.asset,
      destination: post.destination,
      transactionHash,
      memo: `Payment for post ${postId}`,
      status: "completed",
    });

    await paymentRecord.save();

    ctx.set.status = 200;
    return {
      message: "Payment completed successfully",
      postId,
      transactionHash,
      hasAccess: true,
    };
  } catch (error) {
    console.error("Error completing post payment:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
