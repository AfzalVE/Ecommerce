import { apiSlice } from "../../../app/api/apiSlice";

export const adminOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10, search = "", orderStatus = "", paymentStatus = "" }) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (search) params.set("search", search);
        if (orderStatus) params.set("orderStatus", orderStatus);
        if (paymentStatus) params.set("paymentStatus", paymentStatus);

        return `/admin/orders?${params.toString()}`;
      },
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query({
      query: (id) => `/admin/orders/${id}`,
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    updatePaymentStatus: builder.mutation({
      query: ({ id, paymentStatus }) => ({
        url: `/admin/orders/${id}/payment`,
        method: "PATCH",
        body: { paymentStatus },
      }),
      invalidatesTags: ["Orders"],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCancelOrderMutation,
  useDownloadInvoiceQuery,
  useDeleteOrderMutation,
} = adminOrderApi;