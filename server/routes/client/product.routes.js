import express from "express";
import {
  getProducts,
  getProductById,
} from "../../controllers/client/product.controller.js";

const router = express.Router();

// ==============================
// PUBLIC PRODUCT ROUTES
// ==============================

// get all products
router.get("/", getProducts);

// get single product
router.get("/:id", getProductById);

export default router;