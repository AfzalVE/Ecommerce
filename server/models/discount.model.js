import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
{
  name: String,

  type: {
    type: String,
    enum: ["percentage", "fixed"]
  },

  value: Number,

  appliesTo: {
    type: String,
    enum: ["product", "category", "global"]
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  startDate: Date,

  endDate: Date,

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;