import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../shared/utils/constants";

export const adminProductApi = createApi({
  reducerPath: "adminProductApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        headers.set("ngrok-skip-browser-warning", "true");
      const token = getState().auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Products"],

  endpoints: (builder) => ({

    // CREATE PRODUCT
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/admin/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // UPDATE PRODUCT
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // DELETE PRODUCT
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // ADMIN PRODUCT LIST
    getAdminProducts: builder.query({
      query: () => "/admin/products",
      providesTags: ["Products"],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
    }),

  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} = adminProductApi;