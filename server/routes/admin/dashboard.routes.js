import express from "express";
import {
  getDashboardStats,
  getItemsAddedGraph,
  getItemsSoldGraph,
  getProfitGraph,
  getTotalSoldGraph,
} from "../../controllers/admin/dashboard.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/role.middleware.js";

const router = express.Router();

/**
 * 📊 DASHBOARD STATS
 */
router.get("/stats", protect, isAdmin, getDashboardStats);

/**
 * 📈 GRAPHS
 */

// 1️⃣ Items Added (Products created)
router.get("/graph/items-added", protect, isAdmin, getItemsAddedGraph);

// 2️⃣ Items Sold (with filter + optional productId)
router.get("/graph/items-sold", protect, isAdmin, getItemsSoldGraph);

// 3️⃣ Profit Graph
router.get("/graph/profit", protect, isAdmin, getProfitGraph);

// 4️⃣ Total Products Sold
router.get("/graph/total-sold", protect, isAdmin, getTotalSoldGraph);

export default router;