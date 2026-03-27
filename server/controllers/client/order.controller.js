// controllers/order.controller.js
import fs from "fs";
import path from "path";
import Order from "../../models/order.model.js";
import redisClient from "../../config/redis.js";
import { createOrderService } from "../../services/order.service.js";
import logger from "../../utils/logger.js";

// 🔑 Helper: Redis Cache Keys
const getOrdersCacheKey = (userId, page, limit, status) =>
  `orders:${userId}:page:${page}:limit:${limit}:status:${status || "all"}`;
const getOrderCacheKey = (orderId) => `order:${orderId}`;

/* ==============================
   CREATE ORDER
============================== */
export const createOrder = async (req, res) => {
  try {
    const result = await createOrderService({
      user: req.user,
      body: req.body,
    });

    // 🔥 Invalidate user's orders cache
    const userId = req.user._id.toString();
    // Optionally, delete all user's paginated orders cache
    const keys = await redisClient.keys(`orders:${userId}:*`);
    if (keys.length) await redisClient.del(keys);

    res.status(201).json(result);
  } catch (error) {
    logger.error("❌ Create order failed: " + error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   GET MY ORDERS (WITH FILTERS, PAGINATION & REDIS)
============================== */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const cacheKey = getOrdersCacheKey(userId, page, limit, status);

    // 🔥 Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("⚡ Orders cache hit");
      return res.json({ success: true, ...JSON.parse(cached), cached: true });
    }

    logger.info("📦 Orders cache miss → DB fetch");

    // Build filter
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

    const response = { orders, page, totalPages, totalOrders };

    // 💾 Store in Redis for 10 min
    await redisClient.setEx(cacheKey, 600, JSON.stringify(response));

    res.json({ success: true, ...response, cached: false });
  } catch (error) {
    logger.error("❌ Get orders failed: " + error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==============================
   GET ORDER BY ID
============================== */
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const cacheKey = getOrderCacheKey(orderId);

    // 🔥 Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("⚡ Order cache hit");
      return res.json({ success: true, order: JSON.parse(cached), cached: true });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 💾 Cache for 10 min
    await redisClient.setEx(cacheKey, 600, JSON.stringify(order));

    res.json({ success: true, order, cached: false });
  } catch (error) {
    logger.error("❌ Get order by ID failed: " + error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==============================
   CANCEL ORDER
============================== */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    // 🔥 Invalidate caches
    await redisClient.del(getOrderCacheKey(order._id));
    const userId = req.user._id.toString();
    const keys = await redisClient.keys(`orders:${userId}:*`);
    if (keys.length) await redisClient.del(keys);

    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    logger.error("❌ Cancel order failed: " + error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// DOWNLOAD INVOICE
// ==============================

export const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.invoicePath) {
      return res.status(404).json({ message: "Invoice not available" });
    }

    const filePath = order.invoicePath;

    // ✅ Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Invoice file not found" });
    }

    // ✅ Get filename (ORD-xxx.pdf)
    const fileName = path.basename(filePath);

    // ✅ Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileName}"`
    );

    // ✅ Stream file
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};