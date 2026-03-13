import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
{

  code: {
    type: String,
    unique: true,
    uppercase: true,
    index: true
  },

  type: {
    type: String,
    enum: ["percentage", "fixed"]
  },

  value: Number,

  minOrderAmount: Number,

  maxDiscount: Number,

  usageLimit: Number,

  usedCount: {
    type: Number,
    default: 0
  },

  expiresAt: Date,

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;