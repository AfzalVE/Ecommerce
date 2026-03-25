import Category from "../../models/category.model.js";
import client from "../../config/elasticsearch.js";
import redis from "../../config/redis.js";
import logger from "../../utils/logger.js";
import Product from "../../models/product.model.js";
import mongoose from "mongoose";



// ======================================
// GET PRODUCTS BY CATEGORY (ES + REDIS)
// ======================================


// export const getCategoryProducts = async (req, res) => {
//   console.log("Category products request received with params:", req.params, "and query:", req.query);

//   const { categoryId } = req.params;
//   if (!categoryId) {
//     return res.status(400).json({ success: false, message: "Category ID is required" });
//   }

//   try {
//     const { categoryId } = req.params;
//     let { page = 1, limit = 12, search = "", minPrice, maxPrice, brand, sort = "" } = req.query;

//     page = Number(page) || 1;
//     limit = Number(limit) || 12;
//     const from = (page - 1) * limit;

//     const cacheKey = `cat:${categoryId}:p:${page}:l:${limit}:s:${sort}:q:${search}:min:${minPrice || ""}:max:${maxPrice || ""}:b:${brand || ""}`;
//     const cached = await redis.get(cacheKey);
//     if (cached) return res.status(200).json({ ...JSON.parse(cached), source: "cache" });

//     // ====== Elasticsearch query ======
//     const must = [{ term: { "category.keyword": categoryId } }];

//     if (search) {
//       must.push({
//         multi_match: {
//           query: search,
//           fields: ["name", "description"],
//         },
//       });
//     }

//     const filter = [];
//     if (minPrice || maxPrice) {
//       filter.push({
//         range: {
//           price: {
//             gte: minPrice ? Number(minPrice) : 0,
//             lte: maxPrice ? Number(maxPrice) : 1000000,
//           },
//         },
//       });
//     }
//     if (brand) filter.push({ term: { "brand.keyword": brand } });

//     const sortMap = {
//       '': { createdAt: 'desc' },
//       'popular': { sold: 'desc' },
//       'price_asc': { price: 'asc' },
//       'price_desc': { price: 'desc' },
//       'newest': { createdAt: 'desc' }
//     };
//     const sortObj = sortMap[sort] || { createdAt: 'desc' };

//     const result = await client.search({
//       index: "products",
//       from,
//       size: limit,
//       query: { bool: { must, filter } },
//       sort: [sortObj],
//     });

//     const products = result.hits.hits.map(hit => ({ _id: hit._id, ...hit._source }));
//     const total = result.hits.total.value;

//     const response = { success: true, products, total, page, pages: Math.ceil(total / limit) };
//     await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

//     console.log("Category products response:", response);
//     return res.status(200).json({ ...response, source: "es" });

//   } catch (error) {
//     logger.error("Category products error: " + error.message);
//     return res.status(500).json({ success: false, message: "Failed to fetch category products" });
//   }
// };


export const getCategoryProducts = async (req, res) => {
  console.log(req.method, req.originalUrl, "params:", req.params, "query:", req.query);

  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required"
    });
  }

  try {
    let {
      page = 1,
      limit = 12,
      search = "",
      minPrice,
      maxPrice,
      brand,
      sort = ""
    } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 12;
    const skip = (page - 1) * limit;

    // ====== MATCH STAGE ======
    const matchStage = {
      category: new mongoose.Types.ObjectId(categoryId)
    };

    // Search
    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // ====== AGGREGATION PIPELINE ======
    const pipeline = [
      { $match: matchStage },

      // Calculate min & max price from variants
      {
        $addFields: {
          minPrice: { $min: "$variants.price" },
          maxPrice: { $max: "$variants.price" }
        }
      }
    ];

    // ====== PRICE FILTER ======
    if (minPrice || maxPrice) {
      pipeline.push({
        $match: {
          minPrice: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) })
          }
        }
      });
    }

    // ====== SORTING ======
    let sortStage = { createdAt: -1 };

    if (sort === "price_asc") sortStage = { minPrice: 1 };
    if (sort === "price_desc") sortStage = { minPrice: -1 };
    if (sort === "popular") sortStage = { sold: -1 }; // only if exists
    if (sort === "newest") sortStage = { createdAt: -1 };

    pipeline.push({ $sort: sortStage });

    // ====== PAGINATION ======
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    // ====== EXECUTE ======
    const products = await Product.aggregate(pipeline);

    // ====== TOTAL COUNT (separate pipeline) ======
    const countPipeline = [
      { $match: matchStage },
      {
        $addFields: {
          minPrice: { $min: "$variants.price" }
        }
      }
    ];

    if (minPrice || maxPrice) {
      countPipeline.push({
        $match: {
          minPrice: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) })
          }
        }
      });
    }

    countPipeline.push({ $count: "total" });

    const countResult = await Product.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // ====== DEBUG ======
    console.log("Sort:", sort);
    console.log("Products minPrice:", products.map(p => p.minPrice));

    const response = {
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error("Category products error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category products"
    });
  }
};

// ======================================
// GET SINGLE PRODUCT (ES + REDIS)
// ======================================

export const getCategoryProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const cacheKey = `product:${productId}`;

    // 🔁 Cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        product: JSON.parse(cached),
        source: "cache",
      });
    }

    // 🔍 Elasticsearch
    const result = await client.get({
      index: "products",
      id: productId,
    });

    const product = result._source;

    // 💾 Cache (10 min)
    await redis.set(cacheKey, JSON.stringify(product), "EX", 600);

    return res.status(200).json({
      success: true,
      product,
      source: "es",
    });

  } catch (error) {
    logger.error("Get product by ID failed: " + error.message);

    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
};
