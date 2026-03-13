import express from "express";
import {
 createProduct,
 getProducts,
 getProductById,
 updateProduct,
 deleteProduct
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/*
 ADMIN PRODUCT ROUTES
*/

router.post("/", protect, upload.any(), createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", protect, upload.any(), updateProduct);

router.delete("/:id", protect, deleteProduct);

export default router;