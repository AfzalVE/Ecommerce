import { apiSlice } from "../../app/api/apiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🗨️ Send a user message to backend
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: "/chat/send",
        method: "POST",
        body: messageData,
        credentials: "include",
      }),
    }),

    // 🕵️‍♂️ Fetch chat history
    getChatHistory: builder.query({
      query: () => ({
        url: "/chat/history",
        credentials: "include",
      }),
    }),

    // 🧹 Clear chat history
    clearChatHistory: builder.mutation({
      query: () => ({
        url: "/chat/clear",
        method: "POST",
        credentials: "include",
      }),
    }),

    // 📥 Get suggested questions (optional backend prompts)
    getSuggestedQuestions: builder.query({
      query: () => ({
        url: "/chat/suggested-questions",
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useClearChatHistoryMutation,
  useGetSuggestedQuestionsQuery,
} = chatApi;