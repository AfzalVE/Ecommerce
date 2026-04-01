import mongoose from "mongoose";

/* ==============================
   ORDER ITEM SCHEMA
============================== */
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    name: { type: String, required: true },
    color: String,
    size: String,

    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },

    image: String,
  },
  { _id: false }
);

/* ==============================
   ORDER SCHEMA
============================== */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    /* =========================
       PRICING
    ========================== */
    totalAmount: {
      type: Number,
      required: true,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },

    /* =========================
       ADDRESS
    ========================== */
    address: {
      name: { type: String, required: true },
      email: String,
      phone: { type: String, required: true },

      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    /* =========================
       PAYMENT
    ========================== */
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "cod",
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refund_initiated",
        "refunded",
        "refund_failed",
      ],
      default: "pending",
      index: true,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    /* =========================
       REFUND TRACKING
    ========================== */
    refundId: String,
    refundAmount: Number,
    refundReason: String,

    /* =========================
       ORDER STATUS
    ========================== */
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    /* =========================
       INVOICE
    ========================== */
    invoicePath: String,
  },
  {
    timestamps: true,
  }
);

/* ==============================
   INDEXES (PERFORMANCE)
============================== */
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ razorpayPaymentId: 1 });

/* ==============================
   MODEL EXPORT
============================== */
const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;