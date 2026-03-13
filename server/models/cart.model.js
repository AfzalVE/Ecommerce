import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({

 product: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
  required: true
 },

 variantId: mongoose.Schema.Types.ObjectId,   // 🔥 reference to variant

 color: String,

 size: String,

 quantity: {
  type: Number,
  default: 1
 },

 priceSnapshot: Number,

 discountApplied: Number,

 finalPrice: Number

});

const cartSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    index: true
  },

  items: [cartItemSchema]

},
{ timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;