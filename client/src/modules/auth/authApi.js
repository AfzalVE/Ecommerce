import { apiSlice } from "../../app/api/apiSlice";
import { setAuth, logout, setLoading } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // 🔐 LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        credentials: "include", // ✅ ensure cookie is stored
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // ✅ backend already sets cookie
          dispatch(setAuth(data.user));

        } catch (err) {
          console.error("Login error:", err);
        }
      },
    }),

    // 📝 REGISTER
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // 🚪 LOGOUT
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(logout());

          // ✅ clear RTK cache (important)
          dispatch(apiSlice.util.resetApiState());

        } catch (err) {
          console.error("Logout error:", err);
        }
      },
    }),

    // 👤 CURRENT USER (VERY IMPORTANT FOR REFRESH)
    getCurrentUser: builder.query({
      query: () => ({
        url: "/auth/me",
        credentials: "include",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading());

          const { data } = await queryFulfilled;

          dispatch(setAuth(data.user));

        } catch (err) {
          // ❌ user not logged in OR cookie missing
          dispatch(logout());
        }
      },
    }),

    // 🔐 OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

  }),

  overrideExisting: false,
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