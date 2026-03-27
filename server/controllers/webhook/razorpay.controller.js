import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import crypto from "crypto";
import { addEmailJob } from "../../infrastructure/queues/email.queue.js";

/**
 * Razorpay Webhook Handler
 * Handles successful payments and updates order status, stock, and triggers email
 */
export const razorpayWebhook = async (req, res) => {
  console.log("📩 Received Razorpay webhook");

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!secret) {
      console.error("❌ Webhook secret missing");
      return res.status(500).json({ message: "Webhook secret not configured" });
    }

    if (!signature) {
      console.error("❌ Signature missing");
      return res.status(400).json({ message: "Missing signature" });
    }

    // ✅ RAW BODY (BUFFER)
    const rawBody = req.body;

    if (!rawBody || !Buffer.isBuffer(rawBody)) {
      console.error("❌ Raw body is not a buffer");
      return res.status(400).json({ message: "Invalid raw body" });
    }

    console.log("✅ Raw body received (Buffer)");

    // ✅ VERIFY SIGNATURE
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    console.log("✅ Signature verified");

    // ✅ PARSE BODY AFTER VERIFICATION
    const body = JSON.parse(rawBody.toString());
    const event = body.event;

    console.log("📌 Event:", event);

    // ✅ HANDLE PAYMENT SUCCESS
    if (event === "payment.captured") {
      const payment = body.payload.payment.entity;

      const order = await Order.findOne({
        razorpayOrderId: payment.order_id,
      });

      if (!order) {
        console.warn("⚠️ Order not found");
        return res.json({ received: true });
      }

      // ✅ Prevent duplicate processing
      if (order.paymentStatus === "paid") {
        console.log("⚠️ Order already processed");
        return res.json({ received: true });
      }

      // ✅ UPDATE ORDER
      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.razorpayPaymentId = payment.id;

      // 🔥 UPDATE STOCK
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

      console.log("✅ Order updated:", order._id);

      // 📨 SEND EMAIL
      await addEmailJob({ orderId: order._id });
    }

    return res.json({ received: true });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.status(500).json({ message: error.message });
  }
};