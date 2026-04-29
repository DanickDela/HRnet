import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  },

  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },

    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
