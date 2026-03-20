// controllers/client/product.controller.js

import Product from "../../models/product.model.js";
import logger from "../../utils/logger.js";

// ==============================
// GET PRODUCTS (PUBLIC)
// ==============================

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category,
      sort = "createdAt",
    } = req.query;

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);

    logger.info(`Products fetched: ${products.length}`);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error) {
    logger.error("Fetch products failed: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ==============================
// GET PRODUCT BY ID (PUBLIC)
// ==============================

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "category",
      "name slug"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    logger.info(`Product fetched: ${product.title}`);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.error("Fetch product failed: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};