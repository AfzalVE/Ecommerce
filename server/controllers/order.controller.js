import Order from "../models/order.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createOrderService } from "../services/order.service.js";
import Product from "../models/product.model.js";




// ==============================
// USER FUNCTIONS
// ==============================


export const createOrder = async (req, res) => {

  try {

    const result = await createOrderService({
      user: req.user,
      body: req.body
    });

    res.status(201).json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    res.json({
      success: true,
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const cancelOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    if (order.status !== "pending") {

      return res.status(400).json({
        message: "Order cannot be cancelled"
      });

    }

    order.status = "cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ==============================
// ADMIN FUNCTIONS
// ==============================


export const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    order.status = status;

    await order.save();

    res.json({
      success: true,
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const deleteOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ==============================
// RAZORPAY WEBHOOK
// ==============================



export const razorpayWebhook = async (req, res) => {

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const body = JSON.parse(req.body.toString());
    const event = body.event;

    if (event === "payment.captured") {

      const payment = body.payload.payment.entity;
      const order = await Order.findOne({
        razorpayOrderId: payment.order_id
      });

      if (!order) return res.json({ received: true });

      // ✅ prevent duplicate webhook
      if (order.paymentStatus === "paid") {
        return res.json({ received: true });
      }

      // ✅ update order
      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.razorpayPaymentId = payment.id;

      // ✅ reduce stock
      for (const item of order.items) {

        const product = await Product.findById(item.productId);

        if (!product) continue;

        const variant = product.variants.find(
          v => v._id.toString() === item.variantId.toString()
        );

        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }

        await product.save();
      }

      await order.save();

      await addEmailJob({ orderId: order._id });
    }

    res.json({ received: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};