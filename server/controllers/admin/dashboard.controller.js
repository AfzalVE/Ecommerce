import Order from "../../models/Order.model.js";
import Product from "../../models/Product.model.js";
import Category from "../../models/Category.model.js";
import logger from "../../utils/logger.js";
import { getOrSetCache } from "../../utils/cache.js";

export const getDashboardStats = async (req, res) => {
  const cacheKey = "dashboard:stats";

  try {
    logger.info(`📊 Dashboard stats request`);

    const data = await getOrSetCache(
      cacheKey,
      async () => {
        logger.info("📦 Fetching dashboard stats from DB");

        const [
          totalOrders,
          totalProducts,
          totalCategories,
        ] = await Promise.all([
          Order.countDocuments(),
          Product.countDocuments(),
          Category.countDocuments(),
        ]);

        logger.info(
          `📊 DB Stats → orders=${totalOrders}, products=${totalProducts}, categories=${totalCategories}`
        );

        return {
          success: true,
          stats: {
            totalOrders,
            totalProducts,
            totalCategories,
          },
        };
      },
      600
    );

    logger.info("✅ Dashboard stats response sent");

    res.json(data);

  } catch (err) {
    logger.error(`❌ Dashboard error: ${err.message}`);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};