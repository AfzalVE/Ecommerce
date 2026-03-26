import { apiSlice } from "../../../app/api/apiSlice";

export const clientOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    getUserOrders: builder.query({
      query: () => "/orders/my",
      providesTags: ["Order"],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery
} = clientOrderApi;