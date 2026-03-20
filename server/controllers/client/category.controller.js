import Category from "../../models/category.model.js";
import logger from "../../utils/logger.js";

// ==============================
// GET ALL CATEGORIES (PUBLIC)
// ==============================

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    logger.error("Fetch categories failed: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// ==============================
// GET SINGLE CATEGORY
// ==============================

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    logger.error("Fetch category failed: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};