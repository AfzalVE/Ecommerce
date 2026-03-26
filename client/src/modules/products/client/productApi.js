import { apiSlice } from "../../../app/api/apiSlice";

export const clientProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getFilteredProducts: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/products${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Products"],
    }),

    getRelatedProducts: builder.query({
      query: (id) => `/products/${id}/related`,
    }),

  }),
});

export const {
  useGetFilteredProductsQuery,
  useGetRelatedProductsQuery,
} = clientProductApi;