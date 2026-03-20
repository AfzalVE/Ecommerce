import express from "express";

import authRoutes from "../routes/auth.routes.js";
import productRoutes from "../routes/client/product.routes.js";
import categoryRoutes from "../routes/client/category.routes.js";
import reviewRoutes from "../routes/client/review.routes.js";
import cartRoutes from "../routes/client/cart.routes.js";
import orderRoutes from "../routes/client/order.routes.js";

const router = express.Router();

/*
 CLIENT ROUTES
*/

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;