// controllers/client/product.controller.js

import mongoose from "mongoose";
import Product from "../../models/product.model.js";
import logger from "../../utils/logger.js";

// ==============================
// GET PRODUCTS (PUBLIC)
// ==============================
export const getProducts = async (req, res) => {
  try {
    // =============================
    // 📥 QUERY PARAMS
    // =============================
    let {
      page = 1,
      limit = 12,
      search = "",
      category,
      sort = "newest",
      minPrice,
      maxPrice,
      color,
      size,
    } = req.query;

    // ✅ SAFE PARSING
    page = Number(page) > 0 ? Number(page) : 1;
    limit = Number(limit) > 0 ? Number(limit) : 12;
    const skip = (page - 1) * limit;

    // =============================
    // 🧠 MATCH STAGE
    // =============================
    const matchStage = {};

    // 🔍 SEARCH
    if (search?.trim()) {
      matchStage.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // 📂 CATEGORY
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // =============================
    // 🎨 VARIANT FILTER BUILD
    // =============================
    const variantConditions = [];

    // 💰 PRICE
    if (minPrice || maxPrice) {
      const priceCond = [];

      if (minPrice) {
        priceCond.push({
          $gte: ["$$variant.price", Number(minPrice)],
        });
      }

      if (maxPrice) {
        priceCond.push({
          $lte: ["$$variant.price", Number(maxPrice)],
        });
      }

      variantConditions.push(...priceCond);
    }

    // 🎨 COLOR
    if (color) {
      variantConditions.push({
        $in: ["$$variant.color", color.split(",")],
      });
    }

    // 📏 SIZE
    if (size) {
      variantConditions.push({
        $in: ["$$variant.size", size.split(",")],
      });
    }

    // =============================
    // 🔃 SORT
    // =============================
    const getSortOption = () => {
      switch (sort) {
        case "price_asc":
          return { minPrice: 1 };
        case "price_desc":
          return { minPrice: -1 };
        case "oldest":
          return { createdAt: 1 };
        default:
          return { createdAt: -1 };
      }
    };

    // =============================
    // 🚀 PIPELINE
    // =============================
    const pipeline = [
      { $match: matchStage },

      // ✅ FILTER VARIANTS
      ...(variantConditions.length
        ? [
            {
              $addFields: {
                variants: {
                  $filter: {
                    input: "$variants",
                    as: "variant",
                    cond: {
                      $and: variantConditions,
                    },
                  },
                },
              },
            },
            {
              $match: {
                variants: { $ne: [] },
              },
            },
          ]
        : []),

      // ✅ MIN PRICE
      {
        $addFields: {
          minPrice: { $min: "$variants.price" },
        },
      },

      // ✅ CATEGORY POPULATE
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ SORT
      { $sort: getSortOption() },

      // ✅ PAGINATION + COUNT
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    // =============================
    // 🧾 EXECUTE
    // =============================
    const result = await Product.aggregate(pipeline);

    const products = result[0]?.products || [];
    const totalProducts = result[0]?.totalCount[0]?.count || 0;

    logger.info(`Products fetched: ${products.length}`);

    // =============================
    // 📤 RESPONSE
    // =============================
    return res.status(200).json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

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