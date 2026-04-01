// controllers/order.controller.js

import fs from "fs";
import path from "path";
import Razorpay from "razorpay";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import { createOrderService } from "../../services/order.service.js";
import logger from "../../utils/logger.js";
import { refundPayment } from "../../services/refund.service.js";

/* ==============================
   RAZORPAY INIT
============================== */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ==============================
   CREATE ORDER
============================== */
export const createOrder = async (req, res) => {
  try {
    const result = await createOrderService({
      user: req.user,
      body: req.body,
    });

    return res.status(201).json(result);
  } catch (error) {
    logger.error("❌ Create order failed: " + error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   GET MY ORDERS
============================== */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const filter = { user: userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email");

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    return res.json({
      success: true,
      orders,
      page,
      totalPages,
      totalOrders,
    });

  } catch (error) {
    logger.error("❌ Get orders failed: " + error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   GET ORDER BY ID
============================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });

  } catch (error) {
    logger.error("❌ Get order by ID failed: " + error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   CANCEL ORDER (PRODUCTION SAFE)
============================== */


export const cancelOrder = async (req, res) => {
  console.log("🎯 CANCEL HIT:", req.params.id);

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.json({ message: "Already cancelled", order });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled",
      });
    }

    console.log("📦 Cancelling order:", order._id);

    /* =========================
       RESTORE STOCK FIRST
    ========================== */
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const variant = product.variants.id(item.variantId);
      if (variant) {
        variant.stock += item.quantity;
      }

      await product.save();
    }

    /* =========================
       UPDATE ORDER STATUS
    ========================== */
    order.status = "cancelled";
    await order.save();

    console.log("✅ Order cancelled");

    /* =========================
       TRIGGER REFUND (ASYNC SAFE)
    ========================== */
    if (
      order.paymentMethod === "razorpay" &&
      order.paymentStatus === "paid"
    ) {
      console.log("💸 Triggering refund...");

      refundPayment(order).catch((err) => {
        console.error("❌ Refund async error:", err.message);
      });
    }

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error("❌ Cancel error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   DOWNLOAD INVOICE
============================== */
export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.invoicePath) {
      return res.status(404).json({ message: "Invoice not available" });
    }

    if (!fs.existsSync(order.invoicePath)) {
      return res.status(404).json({ message: "Invoice file not found" });
    }

    const fileName = path.basename(order.invoicePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    fs.createReadStream(order.invoicePath).pipe(res);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};