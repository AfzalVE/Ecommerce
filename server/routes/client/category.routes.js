import express from "express";
import {
  getCategoryProducts,
  getCategoryProductById,
} from "../../controllers/client/category.controller.js";
import { getCategories } from "../../controllers/admin/category.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:categoryId/products", getCategoryProducts);
router.get("/product/:productId", getCategoryProductById);

export default router;