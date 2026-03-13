import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import logger from "../utils/logger.js";

/* Create Review */

export const createReview = async (req, res) => {

 try {

  const { productId, rating, comment } = req.body;

  const existingReview = await Review.findOne({
   user: req.user._id,
   product: productId
  });

  if (existingReview) {
   return res.status(400).json({
    success: false,
    message: "You already reviewed this product"
   });
  }

  const review = await Review.create({
   user: req.user._id,
   product: productId,
   rating,
   comment
  });

  logger.info(`Review created by user ${req.user._id}`);

  res.status(201).json({
   success: true,
   review
  });

 } catch (error) {

  logger.error("Create review failed: " + error.message);

  res.status(500).json({
   success: false,
   message: "Failed to create review"
  });

 }

};


/* Get Reviews of a Product */

export const getReviewsByProduct = async (req, res) => {

 try {

  const { productId } = req.params;

  const reviews = await Review
   .find({ product: productId })
   .populate("user", "name");

  const total = reviews.length;

  const avgRating =
   total > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / total
    : 0;

  res.status(200).json({
   success: true,
   reviews,
   totalReviews: total,
   averageRating: avgRating.toFixed(1)
  });

 } catch (error) {

  logger.error("Fetch reviews failed: " + error.message);

  res.status(500).json({
   success: false,
   message: "Failed to fetch reviews"
  });

 }

};


/* Update Review */

export const updateReview = async (req, res) => {

 try {

  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);

  if (!review) {
   return res.status(404).json({
    success: false,
    message: "Review not found"
   });
  }

  if (review.user.toString() !== req.user._id.toString()) {
   return res.status(403).json({
    success: false,
    message: "Not authorized"
   });
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  await review.save();

  res.status(200).json({
   success: true,
   review
  });

 } catch (error) {

  logger.error("Update review failed: " + error.message);

  res.status(500).json({
   success: false,
   message: "Failed to update review"
  });

 }

};


/* Delete Review */

export const deleteReview = async (req, res) => {

 try {

  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
   return res.status(404).json({
    success: false,
    message: "Review not found"
   });
  }

  if (review.user.toString() !== req.user._id.toString()) {
   return res.status(403).json({
    success: false,
    message: "Not authorized"
   });
  }

  await review.deleteOne();

  logger.info(`Review deleted: ${id}`);

  res.status(200).json({
   success: true,
   message: "Review deleted"
  });

 } catch (error) {

  logger.error("Delete review failed: " + error.message);

  res.status(500).json({
   success: false,
   message: "Failed to delete review"
  });

 }

};