import { Context } from "elysia";
import { generateAnalytics } from "../services/analytics.service";

export const getAnalytics = async (ctx: Context) => {
  try {
    const { userAddress } = ctx.body as { userAddress: string };

    if (!userAddress) {
      ctx.set.status = 400;
      return { message: "User address is required" };
    }

    const analytics = await generateAnalytics(userAddress);

    ctx.set.status = 200;
    return JSON.stringify(analytics);
  } catch (error) {
    console.error("Error getting analytics:", error);
    ctx.set.status = 500;
    return {
      message: "internal server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};