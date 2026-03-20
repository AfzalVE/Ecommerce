import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../utils/constants";

export const orderApi = createApi({

  reducerPath: "orderApi",

  tagTypes: ["Order", "Cart"],

  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/orders`,
    credentials: "include"
  }),

  endpoints: (builder) => ({

    /* CREATE ORDER */
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body
      }),
      invalidatesTags: ["Order", "Cart"]
    }),

    /* GET USER ORDERS */
    getUserOrders: builder.query({
      query: () => "/my-orders",
      providesTags: ["Order"]
    })

  })
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery
} = orderApi;