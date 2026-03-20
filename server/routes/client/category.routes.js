import express from "express";
import {
  getCategories,
  getCategoryById,
} from "../../controllers/client/category.controller.js";

const router = express.Router();

// ==============================
// PUBLIC CATEGORY ROUTES
// ==============================

// get all categories
router.get("/", getCategories);

// get single category
router.get("/:id", getCategoryById);

export default router;