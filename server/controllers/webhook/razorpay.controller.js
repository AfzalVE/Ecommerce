import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import crypto from "crypto";
import { addEmailJob } from "../../infrastructure/queues/email.queue.js";

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
        razorpayOrderId: payment.order_id,
      });

      if (!order) return res.json({ received: true });

      if (order.paymentStatus === "paid") {
        return res.json({ received: true });
      }

      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.razorpayPaymentId = payment.id;

      // 🔥 STOCK UPDATE
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
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