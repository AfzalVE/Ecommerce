import { apiSlice } from "../../app/api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET PRODUCTS (FIXED)
    getProducts: builder.query({
      query: (args = {}) => {
        const {
          keyword = "",
          page = 1,
          limit = 12,  
          category = "",
          minPrice = "",
          maxPrice = "",
          color = "",
          size = "",
          sort = "newest",
        } = args;

        let url = `/products?search=${keyword}&page=${page}&limit=${limit}&sort=${sort}`;

        if (category) url += `&category=${category}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (color) url += `&color=${color}`;
        if (size) url += `&size=${size}`;

        return url;
      },

      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Products",
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // ✅ GET SINGLE PRODUCT
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ✅ GET CATEGORIES
    getCategories: builder.query({
      query: () => "/products/categories",
      providesTags: ["Categories"],
    }),

    // ✅ GET CATEGORY COUNT
    getCategoryCount: builder.query({
      query: () => "/products/categories/count",
      providesTags: ["Categories"],
    }),




   

  }),
});

// ✅ EXPORT HOOKS
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetCategoryCountQuery,
} = productApi;