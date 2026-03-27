import mongoose from "mongoose";
import Order from "../../models/Order.model.js";
import Product from "../../models/Product.model.js";
import Category from "../../models/Category.model.js";
import logger from "../../utils/logger.js";
import { getOrSetCache } from "../../utils/cache.js";

/**
 * 🧠 SAFE OBJECT ID
 */
const toObjectId = (id) => {
  if (!id) return null;
  return mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;
};

/**
 * 🧠 DATE FORMAT
 */
const getDateFormat = (type) => {
  switch (type) {
    case "daily":
      return "%Y-%m-%d";
    case "weekly":
      return "%Y-%U";
    case "monthly":
      return "%Y-%m";
    case "yearly":
      return "%Y";
    default:
      return "%Y-%m";
  }
};

/**
 * 📊 DASHBOARD STATS
 */
export const getDashboardStats = async (req, res) => {
  try {
    const data = await getOrSetCache("dashboard:stats", async () => {
      const [totalOrders, totalProducts, totalCategories] =
        await Promise.all([
          Order.countDocuments(),
          Product.countDocuments(),
          Category.countDocuments(),
        ]);

      return {
        success: true,
        stats: {
          totalOrders,
          totalProducts,
          totalCategories,
        },
      };
    }, 600);

    res.json(data);
  } catch (err) {
    logger.error("Dashboard Stats Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 📈 1. ITEMS ADDED
 */
export const getItemsAddedGraph = async (req, res) => {
  try {
    const { filter = "monthly", categoryId } = req.query;

    const format = getDateFormat(filter);
    const categoryObjId = toObjectId(categoryId);

    const match = {};
    if (categoryObjId) {
      match.category = categoryObjId;
    }

    const data = await Product.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    logger.error("Items Added Graph Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 📊 2. ITEMS SOLD (FIXED)
 */
export const getItemsSoldGraph = async (req, res) => {
  try {
    const { filter = "monthly", productId, categoryId } = req.query;

    const format = getDateFormat(filter);
    const productObjId = toObjectId(productId);
    const categoryObjId = toObjectId(categoryId);

    const pipeline = [
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },

      // JOIN PRODUCT
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ];

    // ✅ PRODUCT FILTER (SAFE)
    if (productObjId) {
      pipeline.push({
        $match: { "items.productId": productObjId },
      });
    }

    // ✅ CATEGORY FILTER (SAFE)
    if (categoryObjId) {
      pipeline.push({
        $match: { "product.category": categoryObjId },
      });
    }

    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          totalSold: { $sum: "$items.quantity" },
          productName: { $first: "$product.title" },
        },
      },
      { $sort: { _id: 1 } }
    );

    const data = await Order.aggregate(pipeline);

    res.json({ success: true, data });
  } catch (err) {
    logger.error("Items Sold Graph Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 💰 3. PROFIT GRAPH
 */
export const getProfitGraph = async (req, res) => {
  try {
    const { filter = "monthly" } = req.query;

    const format = getDateFormat(filter);

    const data = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          revenue: { $sum: "$finalAmount" },
          discount: { $sum: "$discountAmount" },
        },
      },
      {
        $project: {
          profit: { $subtract: ["$revenue", "$discount"] },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    logger.error("Profit Graph Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 📦 4. TOTAL SOLD (TOP PRODUCTS)
 */
export const getTotalSoldGraph = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const categoryObjId = toObjectId(categoryId);

    const pipeline = [
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },

      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ];

    // ✅ CATEGORY FILTER SAFE
    if (categoryObjId) {
      pipeline.push({
        $match: { "product.category": categoryObjId },
      });
    }

    pipeline.push(
      {
        $group: {
          _id: "$product._id",
          totalSold: { $sum: "$items.quantity" },
          productName: { $first: "$product.title" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 } // 🔥 top 10 products
    );

    const data = await Order.aggregate(pipeline);

    res.json({ success: true, data });
  } catch (err) {
    logger.error("Total Sold Graph Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};