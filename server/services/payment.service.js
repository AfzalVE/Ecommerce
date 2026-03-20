// services/payment.service.js
import crypto from "crypto";
import Order from "../models/order.model.js";
import { addEmailJob } from "../queues/email.queue.js";

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const body = req.rawBody; // make sure to use raw body middleware

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body.event;

  if (event === "payment.captured") {
    const { order_id, payment_id } = req.body.payload.payment.entity;
    
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: order_id },
      {
        paymentStatus: "paid",
        razorpayPaymentId: payment_id,
        status: "confirmed"
      },
      { new: true }
    );

    // Send confirmation email
    if (order) {
      await addEmailJob({ orderId: order._id });
    }
  }

  res.json({ status: "ok" });
};