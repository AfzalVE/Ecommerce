import express from "express";

import {
 createReview,
 getReviewsByProduct,
 updateReview,
 deleteReview
} from "../controllers/review.controller.js";


const router = express.Router();

/* Create review */

router.post("/",  createReview);

/* Get reviews for a product */

router.get("/:productId", getReviewsByProduct);

/* Update review */

router.put("/:id", updateReview);

/* Delete review */

router.delete("/:id", deleteReview);

export default router;