import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../controllers/admin/order.controller.js";

import { protect, admin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// apply middleware globally
router.use(protect, admin);

// ==============================
// ADMIN ROUTES
// ==============================

// get all orders
router.get("/", getAllOrders);

// update status
router.put("/:id/status", updateOrderStatus);

// delete order
router.delete("/:id", deleteOrder);

export default router;