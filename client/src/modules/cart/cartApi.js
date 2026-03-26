import { apiSlice } from "../../app/api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // 🟢 GET FULL CART
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    // 🟢 GET CART COUNT
    getCartCount: builder.query({
      query: () => "/cart/count",
      providesTags: ["Cart"],
    }),

    // 🟢 ADD TO CART
    addToCart: builder.mutation({
      query: ({ productId, variantId, quantity = 1 }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // 🟢 UPDATE ITEM
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // 🟢 REMOVE ITEM
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // 🟢 CLEAR CART
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useGetCartCountQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;