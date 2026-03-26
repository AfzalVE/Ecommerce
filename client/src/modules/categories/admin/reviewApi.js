import { apiSlice } from "../../app/api/apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getReviews: builder.query({
      query: (productId) => `/reviews/${productId}`,
      providesTags: ["Reviews"],
    }),

    createReview: builder.mutation({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),

  }),
});