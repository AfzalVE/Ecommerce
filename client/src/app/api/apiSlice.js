import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../shared/utils/constants";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      headers.set("ngrok-skip-browser-warning", "true");

      const token = getState()?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  /* 🔥 VERY IMPORTANT */
  tagTypes: [
    "Cart",
    "Category",
    "CategoryProducts",
    "Products",
    "Reviews",
    "Order",
    "Dashboard",
  ],

  endpoints: () => ({}),
});