import { apiSlice } from "../../../app/api/apiSlice";

/* ==============================
   ORDER API (CLIENT)
============================== */
export const clientOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       🟢 CREATE ORDER
    ========================== */
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/create",
        method: "POST",
        body,
      }),

      // ✅ force refresh orders + cart
      invalidatesTags: [{ type: "Order", id: "LIST" }, "Cart"],
    }),

    /* =========================
       🔵 GET USER ORDERS
    ========================== */
    getUserOrders: builder.query({
      query: ({ page = 1, limit = 10, status = "" } = {}) => ({
        url: `/orders/my?page=${page}&limit=${limit}${
          status ? `&status=${status}` : ""
        }`,

        // ✅ CRITICAL: disable browser caching
        headers: {
          "Cache-Control": "no-cache",
        },
      }),

      /* ✅ Proper tagging */
      providesTags: (result) =>
        result?.orders
          ? [
              ...result.orders.map((order) => ({
                type: "Order",
                id: order._id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],

      /* 🔥 FIX: ALWAYS REFRESH */
      keepUnusedDataFor: 0,                 // remove cache immediately
      refetchOnMountOrArgChange: true,     // refetch on page load
      refetchOnFocus: true,                // refetch when tab focused
      refetchOnReconnect: true,            // refetch when internet back
    }),

    /* =========================
       🔴 CANCEL ORDER
    ========================== */
cancelOrder: builder.mutation({
  query: (orderId) => ({
    url: `/orders/${orderId}/cancel`,
    method: "PATCH",
    credentials: "include", // ✅ THIS IS THE FIX
  }),

  invalidatesTags: (result, error, orderId) => [
    { type: "Order", id: orderId },
    { type: "Order", id: "LIST" },
  ],
}),

  }),
});

/* ==============================
   EXPORT HOOKS
============================== */
export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useCancelOrderMutation
} = clientOrderApi;