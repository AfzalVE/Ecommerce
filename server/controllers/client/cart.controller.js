// controllers/cart.controller.js

import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import redisClient from "../../config/redis.js";
import logger from "../../utils/logger.js";

// 🔑 Helper: Cache Keys
const getCartKey = (userId) => `cart:${userId}`;
const getCartCountKey = (userId) => `cart:${userId}:count`;

/**
 * 🟢 GET FULL CART (WITH REDIS CACHE)
 */
export const getCart = async (req, res) => {
  const userId = req.user._id.toString();
  const cacheKey = getCartKey(userId);

  try {
    // 🔥 Check Redis
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("⚡ Cart cache hit");
      return res.json(JSON.parse(cached));
    }

    logger.info("📦 Cart cache miss → DB fetch");

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "title slug variants images",
    });

    const response = {
      success: true,
      cart: cart || { items: [] },
    };

    // 💾 Store in Redis (5 min)
    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

    res.json(response);

  } catch (error) {
    logger.error("❌ Get cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

/**
 * 🟢 GET CART COUNT (SUPER LIGHTWEIGHT + REDIS)
 */
export const getCartCount = async (req, res) => {
  const userId = req.user._id.toString();
  const cacheKey = getCartCountKey(userId);

  try {
    // 🔥 Check Redis first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("⚡ Cart count cache hit");
      return res.json(JSON.parse(cached));
    }

    logger.info("📊 Cart count cache miss → DB fetch");

    const cart = await Cart.findOne({ user: userId }).select("items.quantity");

    const count = cart
      ? cart.items.reduce((acc, item) => acc + item.quantity, 0)
      : 0;

    const response = {
      success: true,
      count,
    };

    // 💾 Cache for 2 min (shorter TTL)
    await redisClient.setEx(cacheKey, 120, JSON.stringify(response));

    res.json(response);

  } catch (error) {
    logger.error("❌ Get cart count failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart count",
    });
  }
};

/**
 * 🟢 ADD TO CART
 */
export const addToCart = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    const { productId, variantId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);
    if (!variant || variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Variant unavailable or insufficient stock",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variantId.toString() === variantId
    );

    const priceSnapshot = variant.price;

    if (index > -1) {
      cart.items[index].quantity += quantity;
      cart.items[index].priceSnapshot = priceSnapshot;
    } else {
      cart.items.push({
        product: productId,
        variantId,
        color: variant.color,
        size: variant.size,
        quantity,
        priceSnapshot,
        finalPrice: priceSnapshot,
      });
    }

    await cart.save();

    // ❌ Invalidate cache
    await redisClient.del(getCartKey(userId));
    await redisClient.del(getCartCountKey(userId));

    logger.info(`🛒 Added to cart: ${product.title} x${quantity}`);

    res.status(201).json({
      success: true,
      message: "Added to cart",
      cart,
    });

  } catch (error) {
    logger.error("❌ Add to cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
    });
  }
};

/**
 * 🟢 UPDATE CART ITEM
 */
export const updateCartItem = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.quantity = quantity;
    await cart.save();

    // ❌ Invalidate cache
    await redisClient.del(getCartKey(userId));
    await redisClient.del(getCartCountKey(userId));

    logger.info(`✏️ Updated cart item → qty: ${quantity}`);

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    });

  } catch (error) {
    logger.error("❌ Update cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

/**
 * 🟢 DELETE CART ITEM
 */
export const deleteCartItem = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    const { id } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { _id: id } } },
      { new: true }
    );

    // ❌ Invalidate cache
    await redisClient.del(getCartKey(userId));
    await redisClient.del(getCartCountKey(userId));

    logger.info("🗑️ Removed item from cart");

    res.json({
      success: true,
      message: "Item removed",
      cart: cart || { items: [] },
    });

  } catch (error) {
    logger.error("❌ Delete item failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove item",
    });
  }
};

/**
 * 🟢 CLEAR CART
 */
export const clearCart = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } }
    );

    // ❌ Invalidate cache
    await redisClient.del(getCartKey(userId));
    await redisClient.del(getCartCountKey(userId));

    logger.info("🧹 Cart cleared");

    res.json({
      success: true,
      message: "Cart cleared",
      cart: { items: [] },
    });

  } catch (error) {
    logger.error("❌ Clear cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};