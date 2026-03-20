import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../shared/utils/constants";

export const cartApi = createApi({
  reducerPath: "cartApi",
  tagTypes: ["Cart"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/cart`,  // /api/cart
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Use cookie auth (backend JWT in httpOnly cookie)
      // Optional: add Bearer if needed
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, variantId, quantity = 1 }) => ({
        url: "",
        method: "POST",
        body: { productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;

