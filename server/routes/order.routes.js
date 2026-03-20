import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  razorpayWebhook
} from "../controllers/order.controller.js";

import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// user
router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/cancel/:id", protect, cancelOrder);

// admin
router.get("/", protect, admin, getAllOrders);
router.put("/status/:id", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

// ✅ ONLY ONE webhook
router.post("/razorpay-webhook", razorpayWebhook);

export default router;