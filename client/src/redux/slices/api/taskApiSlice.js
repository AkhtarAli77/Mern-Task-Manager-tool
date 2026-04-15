import { apiSlice } from "./apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Task CRUD
    createTask: builder.mutation({
      query: (data) => ({
        url: "/task/create",
        method: "POST",
        body: data,
      }),
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: `/task/update/${data._id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `/task?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: "GET",
      }),
    }),
    getSingleTask: builder.query({
      query: (id) => ({
        url: `/task/${id}`,
        method: "GET",
      }),
    }),
    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `/task/${id}`,
        method: "PUT",
        body: { isTrashed: true },
      }),
    }),
    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `/task/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
      }),
    }),
    getDasboardStats: builder.query({
      query: () => ({
        url: "/task/dashboard",
        method: "GET",
      }),
    }),
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `/task/duplicate/${id}`,
        method: "POST",
        body: {},
      }),
    }),
    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `/task/activity/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    changeTaskStage: builder.mutation({
      query: (data) => ({
        url: `/task/change-stage/${data?.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `/task/create-subtask/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    changeSubTaskStatus: builder.mutation({
      query: (data) => ({
        url: `/task/change-status/${data?.id}/${data?.subId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

// ✅ Exports - Sahi aur Galat dono spellings
export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetAllTaskQuery,
  useGetSingleTaskQuery,
  useTrashTaskMutation,
  useTrashTastMutation,
  useDeleteRestoreTaskMutation,
  useDeleteRestoreTastMutation,  // ← Galat spelling (Trash.jsx ke liye)
  useGetDasboardStatsQuery,
  useDuplicateTaskMutation,
  usePostTaskActivityMutation,
  useChangeTaskStageMutation,
  useCreateSubTaskMutation,
  useChangeSubTaskStatusMutation,
} = taskApiSlice;