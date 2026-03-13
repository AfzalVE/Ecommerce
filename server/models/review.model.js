import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
{

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    index: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  comment: String

},
{ timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;