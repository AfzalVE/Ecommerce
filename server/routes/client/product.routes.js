import express from "express";
import {
  getProducts,
  getProductById,
} from "../../controllers/client/product.controller.js";
import { getCategories,getCategoryCount } from "../../controllers/admin/category.controller.js";

const router = express.Router();

// ==============================
// PUBLIC PRODUCT ROUTES
// ==============================

// get all products
router.get("/", getProducts);
router.get("/categories", getCategories);

router.get("/categories/count", getCategoryCount);
// get single product
router.get("/:id", getProductById);



export default router;