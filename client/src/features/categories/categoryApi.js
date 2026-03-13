import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../utils/constants";

export const categoryApi = createApi({
  reducerPath: "categoryApi",

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

  tagTypes: ["Category"],

  endpoints: (builder) => ({

    /* GET CATEGORIES */

    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Category"]
    }),

    /* CREATE */

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Category"]
    }),

    /* UPDATE */

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Category"]
    }),

    /* DELETE */

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Category"]
    })

  })

});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi; 