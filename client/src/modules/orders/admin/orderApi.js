import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../shared/utils/constants";

export const adminOrderApi = createApi({
  reducerPath: "adminOrderApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        headers.set("ngrok-skip-browser-warning", "true");
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    /* =========================
       📦 GET ORDERS (with search & filters)
    ========================== */
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

    /* =========================
       🔍 GET SINGLE ORDER
    ========================== */
    getOrderById: builder.query({
      query: (id) => `/admin/orders/${id}`,
    }),

    /* =========================
       🚚 UPDATE DELIVERY STATUS
    ========================== */
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    /* =========================
       💳 UPDATE PAYMENT STATUS
    ========================== */
    updatePaymentStatus: builder.mutation({
      query: ({ id, paymentStatus }) => ({
        url: `/admin/orders/${id}/payment`,
        method: "PATCH",
        body: { paymentStatus },
      }),
      invalidatesTags: ["Orders"],
    }),

    /* =========================
       ❌ CANCEL ORDER (ADMIN)
    ========================== */
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    /* =========================
       🧾 DOWNLOAD INVOICE
    ========================== */
    downloadInvoice: builder.query({
      query: (id) => ({
        url: `/admin/orders/${id}/invoice`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    /* =========================
       🗑 DELETE ORDER
    ========================== */
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