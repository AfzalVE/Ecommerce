import Product from "../models/product.model.js";
import slugify from "slugify";

export const createProductService = async (data) => {

 const slug = slugify(data.title, { lower: true });

 const product = await Product.create({
  ...data,
  slug
 });

 return product;

};