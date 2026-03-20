import Order from "../../models/order.model.js";
import { createOrderService } from "../../services/order.service.js";

// ==============================
// CREATE ORDER
// ==============================

export const createOrder = async (req, res) => {
  try {
    const result = await createOrderService({
      user: req.user,
      body: req.body,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET MY ORDERS
// ==============================

// controllers/order.controller.js
export const getMyOrders = async (req, res) => {
  try {
    // page and limit from query, default to page 1, 10 orders per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      orders,
      page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// GET ORDER BY ID (USER)
// ==============================

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id, // 🔥 IMPORTANT SECURITY FIX
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// CANCEL ORDER
// ==============================

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id, // 🔥 prevent cancelling others' orders
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};