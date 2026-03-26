import { apiSlice } from "../../app/api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getCategoryProducts: builder.query({
      query: ({ categoryId, ...params } = {}) => ({
        url: `/categories/${categoryId}/products`,
        params,
      }),

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { categoryId, ...rest } = queryArgs || {};
        return `${endpointName}-${categoryId}-${JSON.stringify(rest)}`;
      },

      merge: (currentCache, newData, { arg }) => {
        if (arg?.page && arg.page > 1) {
          currentCache.products = currentCache.products || [];
          currentCache.products.push(...(newData.products || []));
          currentCache.page = newData.page;
        } else {
          return newData;
        }
      },

      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },

      providesTags: (result, error, arg) => [
        { type: "CategoryProducts", id: arg?.categoryId },
      ],
    }),

    getCategoryProductById: builder.query({
      query: (id) => `/categories/product/${id}`,
      providesTags: (r, e, id) => [
        { type: "CategoryProducts", id },
      ],
    }),

    getCategories: builder.query({
      query: () => `/categories`,
      providesTags: ["Category"],
    }),

  }),

  overrideExisting: false,
});

export const {
  useGetCategoryProductsQuery,
  useLazyGetCategoryProductsQuery,
  useGetCategoryProductByIdQuery,
  useGetCategoriesQuery,
} = categoryApi;