import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../shared/utils/constants";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",

     prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "true"); // ✅ FIX
    return headers;
  },
  }),

  tagTypes: ["Products"],

  endpoints: (builder) => ({

    // GET ALL PRODUCTS
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET PRODUCT BY ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productApi;