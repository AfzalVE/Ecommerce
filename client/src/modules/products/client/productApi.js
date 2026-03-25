import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../shared/utils/constants";

export const clientProductApi = createApi({
  reducerPath: "clientProductApi",

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

    // FILTER / SEARCH PRODUCTS
    getFilteredProducts: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/products${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Products"],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // RELATED PRODUCTS
    getRelatedProducts: builder.query({
      query: (id) => `/products/${id}/related`,

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
  useGetFilteredProductsQuery,
  useGetRelatedProductsQuery,
} = clientProductApi;