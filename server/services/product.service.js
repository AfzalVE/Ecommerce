import Product from "../models/product.model.js";
import slugify from "slugify";
import { indexProduct } from "./productSearch.service.js";
import redis from "../config/redis.js";

// ==============================
// CREATE PRODUCT
// ==============================

export const createProductService = async (data) => {
  // ✅ slug
  const slug = slugify(data.title, { lower: true });

  // ✅ create in MongoDB
  const product = await Product.create({
    ...data,
    slug,
  });

  // ============================
  // 🔍 INDEX IN ELASTICSEARCH
  // ============================
  await indexProduct(product);

  // ============================
  // ❌ INVALIDATE REDIS CACHE
  // ============================

  // remove single product cache (safety)
  await redis.del(`product:${product._id}`);

  // ⚠️ IMPORTANT: clear category cache
  // (in production use SCAN instead of KEYS)
  const pattern = `cat:${product.category}:*`;

  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(keys);
  }

  return product;
};