import { Elysia, t } from "elysia";
import { getAnalytics } from "../controllers/analytics.controller";

export const analyticsRoutes = new Elysia({
  detail: {
    tags: ["Analytics"],
  },
})
  .post("/analytics", getAnalytics, {
    body: t.Object({
      userAddress: t.String(),
    }),
  });