import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    index: true
  },

  paymentMethod: {
    type: String,
    enum: ["card", "upi", "netbanking", "cod"]
  },

  transactionId: String,

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  }

},
{ timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;