import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({

  productId: mongoose.Schema.Types.ObjectId,

  variantId: mongoose.Schema.Types.ObjectId, // 🔥 NEW

  name: String,

  color: String,  // 🔥 NEW

  size: String,   // 🔥 NEW

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

  totalAmount: Number,

  discountAmount: Number,

  finalAmount: Number,

  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },

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

const Order = mongoose.model("Order", orderSchema);
export default Order;