import client from "../../config/elasticsearch.js";

export const createProductIndex = async () => {
  const exists = await client.indices.exists({ index: "products" });

  if (exists) {
    console.log("✅ Product index already exists");
    return;
  }

  await client.indices.create({
    index: "products",
    body: {
      mappings: {
        properties: {
          name: { type: "text" },
          description: { type: "text" },
          categoryId: { type: "keyword" },
          price: { type: "float" },
          brand: { type: "keyword" },
          rating: { type: "float" },
          createdAt: { type: "date" },
        },
      },
    },
  });

  console.log("🔥 Product index created");
};