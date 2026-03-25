import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../shared/utils/constants";
import { setAuth, logout } from "./authSlice";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include", // important for cookies

     prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "true"); // ✅ FIX
    return headers;
  },
  }),

  endpoints: (builder) => ({

    // LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
                    console.log("Fetched current user profile:", data);


          dispatch(setAuth(data.user));

        } catch (err) {
          console.error(err);
        }
      },
    }),

    // REGISTER
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // LOGOUT
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // CURRENT USER (AUTO LOGIN)
    getCurrentUser: builder.query({
      query: () => "/auth/me",

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.user));
        } catch {}
      },
    }),

    // SEND OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    // VERIFY OTP
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // RESET PASSWORD
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;