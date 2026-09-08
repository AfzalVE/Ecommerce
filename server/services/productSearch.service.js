import client from "../config/elasticsearch.js";

export const indexProduct = async (product) => {
  try {
    await client.index({
      index: "products",
      id: product._id.toString(),
      document: {
        name: product.title,
        description: product.description,
        categoryId: product.category?.toString() || "",
        price: product.price,
        brand: product.brand,
        rating: product.averageRating || 0,
        createdAt: product.createdAt
      }
    });
  } catch (error) {
    console.error("Failed to index product in Elasticsearch:", error);
  }
};
