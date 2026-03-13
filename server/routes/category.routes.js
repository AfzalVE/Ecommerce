import express from "express";

import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
} from "../controllers/category.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", protect, isAdmin, createCategory);

router.put("/:id", protect, isAdmin, updateCategory);

router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;