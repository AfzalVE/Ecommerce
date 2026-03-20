import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../shared/utils/constants";

export const productApi = createApi({
  reducerPath: "productApi",

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

  endpoints: (builder) => ({

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data
      })
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT", 
        body: data
      }),
    }),

    getProducts: builder.query({
      query: () => "/products"
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Products"]
    }),

  })
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,  
  useGetProductByIdQuery,
  useGetProductsQuery,
  useDeleteProductMutation
} = productApi;