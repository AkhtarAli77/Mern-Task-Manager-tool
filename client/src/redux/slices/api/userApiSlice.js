import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeamLists: builder.query({
      query: ({ search }) => ({
        url: `/user/get-team?search=${search}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
    }),
    getUserTaskStatus: builder.query({
      query: () => ({
        url: "/user/get-status",
        method: "GET",
      }),
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "/user/notifications",
        method: "GET",
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/user/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    markNotiAsRead: builder.mutation({
      query: (data) => ({
        url: `/user/read-noti?isReadType=${data.type}&id=${data?.id}`,
        method: "PUT",
      }),
    }),
    activateUserProfile: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/user/activate/${id}`,
        method: "PUT",
        body: { isActive },
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),
    userAction: builder.mutation({
      query: (data) => ({
        url: `/user/activate/${data?.id}`,
        method: "PUT",
        body: { isActive: data.isActive },
      }),
    }),
  }),
});

export const {
  useGetTeamListsQuery,
  useUpdateUserMutation,
  useGetUserTaskStatusQuery,
  useGetNotificationsQuery,
  useChangePasswordMutation,
  useMarkNotiAsReadMutation,
  useActivateUserProfileMutation,
  useDeleteUserMutation,
  useUserActionMutation,
} = userApiSlice;