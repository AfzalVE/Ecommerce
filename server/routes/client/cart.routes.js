import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  getCart,
  getCartCount, 
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from "../../controllers/client/cart.controller.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(protect);


router.get("/count", getCartCount);


router
  .route("/")
  .get(getCart)
  .post(addToCart);


router.delete("/clear", clearCart);


router
  .route("/:id")
  .patch(updateCartItem)
  .delete(deleteCartItem);

export default router;