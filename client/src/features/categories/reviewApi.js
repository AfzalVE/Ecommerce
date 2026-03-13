import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({

  reducerPath: "reviewApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include"
  }),

  tagTypes: ["Reviews"],

  endpoints: (builder) => ({

    /* Get Reviews of a Product */

    getReviews: builder.query({

      query: (productId) => `/reviews/${productId}`,

      providesTags: ["Reviews"]

    }),

    /* Create Review */

    createReview: builder.mutation({

      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body
      }),

      invalidatesTags: ["Reviews"]

    })

  })

});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation
} = reviewApi;