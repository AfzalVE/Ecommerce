import Razorpay from "razorpay";

/* =========================
   RAZORPAY INSTANCE (GLOBAL)
========================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================
   REFUND FUNCTION
========================= */
export const refundPayment = async (order) => {
  try {
    console.log("💸 Starting refund for order:", order?._id);

    /* =========================
       BASIC VALIDATIONS
    ========================== */
    if (!order) throw new Error("Order not found");

    if (order.paymentMethod !== "razorpay") {
      throw new Error("Only Razorpay payments can be refunded");
    }

    if (!order.razorpayPaymentId) {
      throw new Error("Missing Razorpay payment ID");
    }

    if (!order.paymentStatus) {
      throw new Error("Missing payment status");
    }

    /* =========================
       PREVENT DUPLICATE REFUNDS
    ========================== */
    if (["refund_initiated", "refunded"].includes(order.paymentStatus)) {
      console.log("⚠️ Refund already initiated or completed");
      return null;
    }

    if (order.paymentStatus !== "paid") {
      throw new Error(`Invalid payment state: ${order.paymentStatus}`);
    }

    console.log("📡 Calling Razorpay refund API...");
    console.log("💳 Payment ID:", order.razorpayPaymentId);

    /* =========================
       FETCH PAYMENT
    ========================== */
    const payment = await razorpay.payments.fetch(
      order.razorpayPaymentId
    );

    console.log("🔍 Payment fetched:", payment);

    /* =========================
       VALIDATE PAYMENT
    ========================== */
    if (payment.status !== "captured") {
      throw new Error("Payment is not captured, cannot refund");
    }

    if (payment.amount_refunded > 0) {
      console.log("⚠️ Already refunded partially/full");
      return null;
    }

    /* =========================
       CREATE REFUND (FULL REFUND)
    ========================== */
    console.log("Item Price:",payment.amount);
    const refundAmount = payment.amount - payment.amount_refunded;
    const refund = await razorpay.payments.refund(
      order.razorpayPaymentId,
      {
        amount: refundAmount, // REQUIRED for your SDK
      }
    );

    console.log("✅ Refund created successfully:", refund.id);

    /* =========================
       UPDATE ORDER STATUS
    ========================== */
    order.paymentStatus = "refund_initiated";
    await order.save();

    return refund;

  } catch (error) {
    /* =========================
       ERROR LOGGING (FIXED)
    ========================== */
    console.error(
      "❌ Refund failed:",
      error?.error?.description || error?.message || error
    );

    console.error(
      "❌ FULL ERROR:",
      JSON.stringify(error, null, 2)
    );

    /* =========================
       FAIL-SAFE DB UPDATE
    ========================== */
    try {
      if (order) {
        order.paymentStatus = "refund_failed";
        await order.save();
      }
    } catch (dbError) {
      console.error("❌ DB update failed:", dbError.message);
    }

    throw error;
  }
};