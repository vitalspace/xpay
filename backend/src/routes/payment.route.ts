import { Elysia, t } from "elysia";
import {
  createPayment,
  getPaymentsByUser,
  updatePaymentStatus,
  createPaymentRequest,
  getPaymentRequest,
  completePaymentRequest,
} from "../controllers/payment.controller";

export const paymentRoutes = new Elysia({
  detail: {
    tags: ["Payment"],
  },
})
  .post("/create-payment", createPayment, {
    body: t.Object({
      userId: t.String(),
      amount: t.String(),
      asset: t.String(),
      destination: t.String(),
      transactionHash: t.String(),
      memo: t.Optional(t.String()),
      status: t.Optional(t.Union([t.Literal("pending"), t.Literal("completed"), t.Literal("failed")])),
    }),
  })
  .post("/payments-by-user", getPaymentsByUser, {
    body: t.Object({
      userId: t.String(),
    }),
  })
  .put("/update-payment-status", updatePaymentStatus, {
    body: t.Object({
      transactionHash: t.String(),
      status: t.Union([t.Literal("pending"), t.Literal("completed"), t.Literal("failed")]),
    }),
  })
  .post("/create-payment-request", createPaymentRequest, {
    body: t.Object({
      userId: t.String(),
      amount: t.String(),
      asset: t.String(),
      destination: t.String(),
      memo: t.Optional(t.String()),
    }),
  })
  .get("/payment-request/:paymentRequestId", getPaymentRequest, {
    params: t.Object({
      paymentRequestId: t.String(),
    }),
  })
  .post("/complete-payment-request", completePaymentRequest, {
    body: t.Object({
      paymentRequestId: t.String(),
      transactionHash: t.String(),
      payerAddress: t.String(),
    }),
  });