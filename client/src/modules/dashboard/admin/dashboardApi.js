import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../shared/utils/constants";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        headers.set("ngrok-skip-browser-warning", "true");
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Dashboard"],

  endpoints: (builder) => ({

    /* =========================
       📊 GET DASHBOARD STATS
    ========================== */
    getDashboardStats: builder.query({
      query: () => `/admin/dashboard/stats`,
      providesTags: ["Dashboard"],
    }),

  }),
});

export const {
  useGetDashboardStatsQuery,
} = dashboardApi;