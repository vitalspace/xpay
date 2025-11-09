import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import connectDB from "./db/db";
import { userRoutes } from "./routes/user.route";
import { paymentRoutes } from "./routes/payment.route";
import { postRoutes } from "./routes/post.route";
import { analyticsRoutes } from "./routes/analytics.route";

const PORT = process.env.PORT || 2000;
const ORIGIN = process.env.ORIGIN || "http://localhost:5173";

(async () => await connectDB())();

const app = new Elysia()
  .use(
    cors({
      origin: ORIGIN,
      allowedHeaders: ["Content-Type", "x-user-address"],
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )
  .group("/api/v1", (app) => app.use(userRoutes).use(paymentRoutes).use(postRoutes).use(analyticsRoutes))
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
