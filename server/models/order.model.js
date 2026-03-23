import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  variantId: {
    type: mongoose.Schema.Types.ObjectId
  },

  name: String,
  color: String,
  size: String,

  price: Number,
  quantity: Number,
  discount: Number,
  finalPrice: Number,

  image: String

});

const orderSchema = new mongoose.Schema(
{
  orderNumber: {
    type: String,
    unique: true,
    index: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  items: [orderItemSchema],

  totalAmount: {
    type: Number,
    required: true
  },

  discountAmount: {
    type: Number,
    default: 0
  },

  finalAmount: {
    type: Number,
    required: true
  },

  address: {

    name: String,

    email: String,   
    phone: String,

    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String

  },

  paymentMethod: {
    type: String,
    enum: ["cod", "razorpay"],
    default: "cod"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
    index: true
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled"
    ],
    default: "pending",
    index: true
  },

  invoicePath: String

},
{ timestamps: true }
);

const Order =  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;