import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../shared/utils/constants";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["CategoryProducts", "Category"],

  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/categories`,
    credentials: "include",
  }),

  endpoints: (builder) => ({

    // =========================================
    // ✅ GET CATEGORY PRODUCTS (SCALABLE)
    // =========================================
    getCategoryProducts: builder.query({
      query: ({ categoryId, ...params }) => ({
        url: `/${categoryId}/products`,
        params,
      }),

      /**
       * 🔥 IMPORTANT: cache per category + filters
       */
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { categoryId, ...rest } = queryArgs;
        return `${endpointName}-${categoryId}-${JSON.stringify(rest)}`;
      },

      /**
       * 🔥 OPTIONAL: for infinite scroll
       */
      merge: (currentCache, newData, { arg }) => {
        if (arg.page && arg.page > 1) {
          currentCache.products.push(...newData.products);
          currentCache.page = newData.page;
          currentCache.pages = newData.pages;
          currentCache.total = newData.total;
        } else {
          return newData;
        }
      },

      /**
       * 🔥 refetch when params change
       */
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },

      providesTags: (result, error, arg) => [
        { type: "CategoryProducts", id: arg.categoryId },
      ],
    }),

    // =========================================
    // ✅ GET SINGLE PRODUCT (DETAIL PAGE)
    // =========================================
    getCategoryProductById: builder.query({
      query: (productId) => `/product/${productId}`,

      providesTags: (result, error, id) => [
        { type: "CategoryProducts", id },
      ],
    }),

    // =========================================
    // ✅ GET ALL CATEGORIES
    // =========================================
    getCategories: builder.query({
      query: () => "/",

      providesTags: ["Category"],
    }),

  }),
});

export const {
  useGetCategoryProductsQuery,
  useLazyGetCategoryProductsQuery, // 🔥 useful for manual fetch / infinite scroll
  useGetCategoryProductByIdQuery,
  useGetCategoriesQuery,
} = categoryApi;