import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import crypto from "crypto";
import { addEmailJob } from "../../infrastructure/queues/email.queue.js";
import { refundPayment } from "../../services/refund.service.js";

/* ==============================
   RAZORPAY WEBHOOK (FIXED)
============================== */
export const razorpayWebhook = async (req, res) => {
  console.log("📩 Razorpay webhook received");

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!secret || !signature) {
      return res.status(400).json({ message: "Invalid webhook config" });
    }

    /* =========================
       ✅ USE RAW BODY (CRITICAL)
    ========================== */
    const rawBody = req.body.toString();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    /* =========================
       PARSE EVENT
    ========================== */
    const body = JSON.parse(rawBody);

    // ✅ RESPOND IMMEDIATELY (NO DELAY)
    res.status(200).json({ received: true });

    // 🔥 PROCESS IN BACKGROUND
    processWebhook(body);

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

/* ==============================
   BACKGROUND PROCESSOR
============================== */
const processWebhook = async (body) => {
  try {
    const event = body.event;

    console.log("📌 Processing event:", event);

    /* =========================
       PAYMENT SUCCESS
    ========================== */
    if (event === "payment.captured") {
      const payment = body.payload.payment.entity;

      const order = await Order.findById(payment?.notes?.orderId);
      console.log("🔍 Found order for payment:", order);

      if (!order) {
        console.warn("⚠️ Order not found");
        return;
      }

      if (order.paymentStatus === "paid") {
        console.log("⚠️ Already processed");
        return;
      }

      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.razorpayPaymentId = payment.id;
      console.log(payment.id);

      await order.save();

      /* UPDATE STOCK */
      await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) return;

          const variant = product.variants.id(item.variantId);
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }

          await product.save();
        })
      );

      await addEmailJob({ orderId: order._id });

      console.log("✅ Payment captured & order confirmed");
    }

    /* =========================
       PAYMENT FAILED
    ========================== */
    if (event === "payment.failed") {
      const payment = body.payload.payment.entity;

      const order = await Order.findById(payment?.notes?.orderId);

      if (!order) {
        console.warn("⚠️ Order not found");
        return;
      }

      order.paymentStatus = "failed";
      order.status = "cancelled";

      await order.save();

      console.log("❌ Payment failed & order cancelled");
    }

    /* =========================
       ✅ REFUND SUCCESS (FIXED)
    ========================== */
    if (event === "refund.processed") {
      const refund = body.payload.refund.entity;
      console.log(refund)
      console.log("💸 Refund processed:", refund.id);

      const order = await Order.findOne({
        razorpayPaymentId: refund.payment_id,
      });

      if (!order) {
        console.warn("⚠️ Order not found for refund");
        return;
      }

      order.paymentStatus = "refunded";
      order.refundId = refund.id;
      order.refundAmount = refund.amount / 100;

      await order.save();

      console.log("✅ Order marked as refunded");
    }

    /* =========================
       ✅ REFUND FAILED (FIXED)
    ========================== */
    if (event === "refund.failed") {
      const refund = body.payload.refund.entity;

      console.log("❌ Refund failed webhook:", refund.id);

      const order = await Order.findOne({
        razorpayPaymentId: refund.payment_id,
      });

      if (!order) {
        console.warn("⚠️ Order not found for failed refund");
        return;
      }

      order.paymentStatus = "refund_failed";

      await order.save();

      console.log("⚠️ Order marked as refund_failed");
    }

  } catch (error) {
    console.error("❌ Background webhook error:", error.message);
  }
};