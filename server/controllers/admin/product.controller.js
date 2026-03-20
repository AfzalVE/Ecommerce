// controllers/admin/product.controller.js

import Product from "../../models/product.model.js";
import logger from "../../utils/logger.js";
import slugify from "slugify";

// ==============================
// CREATE PRODUCT
// ==============================

export const createProduct = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Product title is required",
      });
    }

    let parsedVariants = [];

    if (req.body.variants) {
      parsedVariants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/variantImages_(\d+)/);
        if (!match) return;

        const variantIndex = match[1];

        if (!parsedVariants[variantIndex]) return;

        if (!parsedVariants[variantIndex].images) {
          parsedVariants[variantIndex].images = [];
        }

        parsedVariants[variantIndex].images.push({
          url: `/uploads/products/${file.filename}`,
          alt: title,
        });
      });
    }

    const product = await Product.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      description,
      category,
      variants: parsedVariants,
      createdBy: req.user._id,
    });

    logger.info(`Product created: ${product.title}`);

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.error("Product creation failed: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Product creation failed",
    });
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let parsedVariants = [];

    if (req.body.variants) {
      parsedVariants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;
    }

    parsedVariants = parsedVariants.map((variant, i) => {
      const existingImages = product.variants[i]?.images || [];

      return {
        ...variant,
        images: [...existingImages],
      };
    });

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/variantImages_(\d+)/);
        if (!match) return;

        const variantIndex = match[1];

        if (!parsedVariants[variantIndex]) return;

        parsedVariants[variantIndex].images.push({
          url: `/uploads/products/${file.filename}`,
          alt: title,
        });
      });
    }

    product.title = title || product.title;
    product.slug = slugify(title || product.title, {
      lower: true,
      strict: true,
    });
    product.description = description || product.description;
    product.category = category || product.category;
    product.variants = parsedVariants;

    await product.save();

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.error("Product update failed: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Product update failed",
    });
  }
};

// ==============================
// DELETE PRODUCT
// ==============================

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    logger.info(`Product deleted: ${product.title}`);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    logger.error("Product delete failed: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Product delete failed",
    });
  }
};