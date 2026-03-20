import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../shared/utils/constants";

export const clientOrderApi = createApi({

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
      query: () => "/my",
      providesTags: ["Order"]
    })

  })
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery
} = clientOrderApi;