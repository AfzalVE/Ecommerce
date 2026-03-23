import mongoose from "mongoose";

/*
 Image Schema
*/

const imageSchema = new mongoose.Schema(
{
 url: {
  type: String,
  required: true
 },
 alt: {
  type: String,
  default: ""
 }
},
{ _id: false }
);

/*
 Variant Schema
*/

const variantSchema = new mongoose.Schema({

 color: {
  type: String,
  required: true,
  index: true
 },

 size: {
  type: String,
  required: true,
  index: true
 },

 sku: {
  type: String,
  required: true,
  unique: true,
  index: true
 },

 price: {
  type: Number,
  required: true
 },

 stock: {
  type: Number,
  default: 0
 },

 images: [imageSchema]

});

/*
 Product Schema
*/

const productSchema = new mongoose.Schema({

 title: {
  type: String,
  required: true,
  index: true
 },

 slug: {
  type: String,
  unique: true,
  index: true
 },

 description: {
  type: String,
  default: ""
 },

 category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  index: true
 },

 variants: [variantSchema],

 createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
 }

},
{ timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;