import express from "express";
import { getDashboardStats} from "../../controllers/admin/dashboard.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getDashboardStats);

export default router;