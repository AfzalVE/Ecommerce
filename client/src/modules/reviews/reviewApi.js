import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../shared/utils/constants";

export const reviewApi = createApi({
  reducerPath: "reviewApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
  }),

  tagTypes: ["Reviews"],

  endpoints: (builder) => ({

    /* Get Reviews of a Product */

    getReviews: builder.query({
      query: (productId) => `/reviews/${productId}`,

      providesTags: (result, error, productId) => [
        { type: "Reviews", id: productId },
      ],
    }),

    /* Create Review */

    createReview: builder.mutation({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),

      invalidatesTags: (result, error, body) => [
        { type: "Reviews", id: body.productId },
      ],
    }),

    /* Delete Review */

    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Reviews"],
    }),

  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;