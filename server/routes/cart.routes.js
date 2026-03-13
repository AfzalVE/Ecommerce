import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protect);  // All routes protected

router
  .route("/")
  .get(getCart)
  .post(addToCart);

router
  .route("/:id")
  .patch(updateCartItem)
  .delete(deleteCartItem);

router.delete("/clear", clearCart);

export default router;

