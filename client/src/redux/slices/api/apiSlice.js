import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    console.log("Token in apiSlice:", token ? "Token exists" : "No token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Task", "User"],
  endpoints: (builder) => ({}),
});