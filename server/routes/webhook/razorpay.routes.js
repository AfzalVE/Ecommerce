import express from "express";
import { razorpayWebhook } from "../../controllers/webhook/razorpay.controller.js";

const router = express.Router();

// ⚠️ IMPORTANT: raw body needed for signature verification
router.post(
  "/razorpay",
  express.raw({ type: "*/*" }),
  razorpayWebhook
);

export default router;