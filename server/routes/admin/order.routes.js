import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "../../controllers/admin/order.controller.js";

import { protect, admin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// apply middleware globally
router.use(protect, admin);

router.get("/", getAllOrders);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment-status", updatePaymentStatus);
router.delete("/:id", deleteOrder);


export default router;