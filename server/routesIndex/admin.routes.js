import express from "express";

import productRoutes from "../routes/admin/product.routes.js";
import categoryRoutes from "../routes/admin/category.routes.js";
import orderRoutes from "../routes/admin/order.routes.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

/*
 🔥 APPLY ADMIN SECURITY GLOBALLY
*/
router.use(protect, isAdmin);

/*
 ADMIN ROUTES
*/

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);

export default router;