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
      query: ({ page = 1, limit = 10, status = "" } = {}) => 
        `/orders/my?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`,
      providesTags: ["Order"],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery
} = clientOrderApi;