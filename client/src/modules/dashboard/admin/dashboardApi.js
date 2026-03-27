import { apiSlice } from "../../../app/api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // 📊 STATS
    getDashboardStats: builder.query({
      query: () => `/admin/dashboard/stats`,
      providesTags: ["Dashboard"],
    }),

    // 📈 ITEMS ADDED GRAPH (WITH CATEGORY FILTER)
    getItemsAddedGraph: builder.query({
      query: ({ filter = "monthly", categoryId } = {}) => {
        const params = new URLSearchParams();

        params.set("filter", filter);
        if (categoryId) params.set("categoryId", categoryId);

        return `/admin/dashboard/graph/items-added?${params.toString()}`;
      },
      providesTags: ["Dashboard"],
    }),

    // 📈 ITEMS SOLD GRAPH (PRODUCT + CATEGORY FILTER)
    getItemsSoldGraph: builder.query({
      query: ({ filter = "monthly", productId, categoryId } = {}) => {
        const params = new URLSearchParams();

        params.set("filter", filter);
        if (productId) params.set("productId", productId);
        if (categoryId) params.set("categoryId", categoryId);

        return `/admin/dashboard/graph/items-sold?${params.toString()}`;
      },
      providesTags: ["Dashboard"],
    }),

    // 💰 PROFIT GRAPH
    getProfitGraph: builder.query({
      query: (filter = "monthly") =>
        `/admin/dashboard/graph/profit?filter=${filter}`,
      providesTags: ["Dashboard"],
    }),

    // 📦 TOTAL SOLD GRAPH (WITH CATEGORY FILTER)
    getTotalSoldGraph: builder.query({
      query: ({ filter = "monthly", categoryId } = {}) => {
        const params = new URLSearchParams();

        params.set("filter", filter);
        if (categoryId) params.set("categoryId", categoryId);

        return `/admin/dashboard/graph/total-sold?${params.toString()}`;
      },
      providesTags: ["Dashboard"],
    }),

  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetItemsAddedGraphQuery,
  useGetItemsSoldGraphQuery,
  useGetProfitGraphQuery,
  useGetTotalSoldGraphQuery,
} = dashboardApi;