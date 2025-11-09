import { Elysia, t } from "elysia";
import { createPost, getPost, completePostPayment } from "../controllers/post.controller";

export const postRoutes = new Elysia({
  detail: {
    tags: ["Posts"],
  },
})
  .post("/create-post", createPost, {
    body: t.Object({
      userId: t.String(),
      title: t.String(),
      content: t.String(),
      amount: t.String(),
      destination: t.String(),
      postId: t.Optional(t.String()),
    }),
  })
  .get("/post/:postId", getPost, {
    params: t.Object({
      postId: t.String(),
    }),
    headers: t.Optional(t.Object({
      "x-user-address": t.Optional(t.String()),
    })),
  })
  .post("/complete-post-payment", completePostPayment, {
    body: t.Object({
      postId: t.String(),
      transactionHash: t.String(),
      payerAddress: t.String(),
    }),
  });