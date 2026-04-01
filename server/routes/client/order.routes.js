import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  downloadInvoice
} from "../../controllers/client/order.controller.js";

import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// ==============================
// USER ROUTES
// ==============================

// create order
router.post("/create", protect, createOrder);

// get logged-in user orders
router.get("/my", protect, getMyOrders);

// get single order (own)
router.get("/:id", protect, getOrderById);

// cancel order
router.patch("/:id/cancel",protect, cancelOrder);

router.get("/:id/invoice", downloadInvoice);

export default router;