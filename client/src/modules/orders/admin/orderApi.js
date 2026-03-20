import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../shared/utils/constants";

export const adminOrderApi = createApi({
  reducerPath: "adminOrderApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    }
  }),

  tagTypes: ["Orders"],

  endpoints: (builder) => ({

    /* =========================
       📦 GET ALL ORDERS
    ========================== */
    getAllOrders: builder.query({
      query: (params) => {
        // supports filters later
        const queryString = new URLSearchParams(params).toString();
        return `/admin/orders?${queryString}`;
      },
      providesTags: ["Orders"]
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
        body: { status }
      }),
      invalidatesTags: ["Orders"]
    }),

    /* =========================
       💳 UPDATE PAYMENT STATUS
    ========================== */
    updatePaymentStatus: builder.mutation({
      query: ({ id, paymentStatus }) => ({
        url: `/admin/orders/${id}/payment`,
        method: "PATCH",
        body: { paymentStatus }
      }),
      invalidatesTags: ["Orders"]
    }),

    /* =========================
       ❌ CANCEL ORDER (ADMIN)
    ========================== */
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}/cancel`,
        method: "PATCH"
      }),
      invalidatesTags: ["Orders"]
    }),

    /* =========================
       🧾 DOWNLOAD INVOICE
    ========================== */
    downloadInvoice: builder.query({
      query: (id) => ({
        url: `/admin/orders/${id}/invoice`,
        responseHandler: (response) => response.blob()
      })
    }),

    /* =========================
       🗑 DELETE ORDER (optional)
    ========================== */
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Orders"]
    }),

  })
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCancelOrderMutation,
  useDownloadInvoiceQuery,
  useDeleteOrderMutation
} = adminOrderApi;