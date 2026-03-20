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

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
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