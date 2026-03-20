import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import logger from "../../utils/logger.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "title slug variants images"
    });

    res.json({
      success: true,
      cart: cart || { items: [] }
    });

  } catch (error) {
    logger.error("Get cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart"
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Find matching variant
    const variant = product.variants.id(variantId);
    if (!variant || variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Variant not available or insufficient stock"
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item exists
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      item.variantId.toString() === variantId
    );

    const priceSnapshot = variant.price;

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].priceSnapshot = priceSnapshot;
    } else {
      cart.items.push({
        product: productId,
        variantId,
        color: variant.color,
        size: variant.size,
        quantity,
        priceSnapshot,
        finalPrice: priceSnapshot
      });
    }

    await cart.save();

    logger.info(`Added to cart: ${product.title} x${quantity}`);

    res.status(201).json({
      success: true,
      message: "Added to cart",
      cart
    });

  } catch (error) {
    logger.error("Add to cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart"
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    logger.info(`Updated cart item quantity to ${quantity}`);

    res.json({
      success: true,
      message: "Cart updated",
      cart
    });

  } catch (error) {
    logger.error("Update cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update cart"
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id, "items._id": id },
      { $pull: { items: { _id: id } } },
      { new: true }
    );

    logger.info("Removed item from cart");

    res.json({
      success: true,
      message: "Item removed",
      cart: cart || { items: [] }
    });

  } catch (error) {
    logger.error("Delete cart item failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove item"
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    logger.info("Cart cleared for user");

    res.json({
      success: true,
      message: "Cart cleared",
      cart: { items: [] }
    });

  } catch (error) {
    logger.error("Clear cart failed: " + error.message);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart"
    });
  }
};

