import { apiSlice } from "../../../app/api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getDashboardStats: builder.query({
      query: () => `/admin/dashboard/stats`,
      providesTags: ["Dashboard"],
    }),

  }),
}); 
export const {
  useGetDashboardStatsQuery,
} = dashboardApi;