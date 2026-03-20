import Product from "../models/product.model.js";
import logger from "../utils/logger.js";
import slugify from "slugify";

export const createProduct = async (req, res) => {

 try {

  const { title, description, category } = req.body;

  if (!title) {
   return res.status(400).json({
    success: false,
    message: "Product title is required"
   });
  }

  /*
   Parse variants safely
  */

  let parsedVariants = [];

  if (req.body.variants) {
   parsedVariants =
    typeof req.body.variants === "string"
     ? JSON.parse(req.body.variants)
     : req.body.variants;
  }

  /*
   Attach uploaded images to correct variants
  */

  if (req.files && req.files.length > 0) {

   req.files.forEach((file) => {

    /*
     fieldname example:
     variantImages_0
     variantImages_1
    */

    const match = file.fieldname.match(/variantImages_(\d+)/);

    if (!match) return;

    const variantIndex = match[1];

    if (!parsedVariants[variantIndex]) return;

    if (!parsedVariants[variantIndex].images) {
     parsedVariants[variantIndex].images = [];
    }

    parsedVariants[variantIndex].images.push({
     url: `/uploads/products/${file.filename}`,
     alt: title
    });

   });

  }

  /*
   Create product
  */

  const product = await Product.create({
   title,
   slug: slugify(title, { lower: true, strict: true }),
   description,
   category,
   variants: parsedVariants,
   createdBy: req.user._id
  });

  logger.info(`Product created: ${product.title}`);

  return res.status(201).json({
   success: true,
   product
  });

 } catch (error) {

  logger.error("Product creation failed: " + error.message);

  return res.status(500).json({
   success: false,
   message: "Product creation failed",
   error: error.message
  });

 }

};

export const getProducts = async (req, res) => {

 try {

  const {
   page = 1,
   limit = 12,
   search = "",
   category,
   sort = "createdAt"
  } = req.query;

  const query = {};

  /*
   Search by title
  */

  if (search) {
   query.title = {
    $regex: search,
    $options: "i"
   };
  }

  /*
   Filter by category
  */

  if (category) {
   query.category = category;
  }

  const skip = (page - 1) * limit;

  /*
   Fetch products
  */

const products = await Product
  .find(query)
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
    totalPages: Math.ceil(totalProducts / limit)
   }
  });

 } catch (error) {

  logger.error("Fetch products failed: " + error.message);

  return res.status(500).json({
   success: false,
   message: "Failed to fetch products"
  });

 }

};
export const getProductById = async (req, res) => {

 try {

  const { id } = req.params;

  const product = await Product
   .findById(id)
   .populate("category", "name slug");

  if (!product) {
   return res.status(404).json({
    success: false,
    message: "Product not found"
   });
  }

  logger.info(`Product fetched: ${product.title}`);

  return res.status(200).json({
   success: true,
   product
  });

 } catch (error) {

  logger.error("Fetch product failed: " + error.message);

  return res.status(500).json({
   success: false,
   message: "Failed to fetch product"
  });

 }

};

export const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;
    const { title, description, category } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    /* ✅ Parse variants */
    let parsedVariants = [];

    if (req.body.variants) {
      parsedVariants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;
    }

    /* ✅ FIX: Preserve old images */
    parsedVariants = parsedVariants.map((variant, i) => {

      const existingImages = product.variants[i]?.images || [];

      return {
        ...variant,
        images: [...existingImages] // keep old images
      };
    });

    /* ✅ Attach NEW uploaded images */
    if (req.files && req.files.length > 0) {

      req.files.forEach((file) => {

        const match = file.fieldname.match(/variantImages_(\d+)/);
        if (!match) return;

        const variantIndex = match[1];

        if (!parsedVariants[variantIndex]) return;

        parsedVariants[variantIndex].images.push({
          url: `/uploads/products/${file.filename}`,
          alt: title
        });

      });

    }

    /* ✅ Update fields */
    product.title = title || product.title;
    product.slug = slugify(title || product.title, { lower: true, strict: true });
    product.description = description || product.description;
    product.category = category || product.category;

    product.variants = parsedVariants;

    await product.save();

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Product update failed"
    });

  }
};

export const deleteProduct = async (req, res) => {

 try {

  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
   return res.status(404).json({
    success: false,
    message: "Product not found"
   });
  }

  await product.deleteOne();

  logger.info(`Product deleted: ${product.title}`);

  return res.status(200).json({
   success: true,
   message: "Product deleted successfully"
  });

 } catch (error) {

  logger.error("Product delete failed: " + error.message);

  return res.status(500).json({
   success: false,                   
   message: "Product delete failed"
  });

 }

};