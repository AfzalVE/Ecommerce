import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/admin/product.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/role.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

// apply admin protection globally
router.use(protect, isAdmin);

// ==============================
// ADMIN PRODUCT ROUTES
// ==============================

// create product
router.post("/", upload.any(), createProduct);

// update product
router.put("/:id", upload.any(), updateProduct);

// delete product
router.delete("/:id", deleteProduct);

export default router;