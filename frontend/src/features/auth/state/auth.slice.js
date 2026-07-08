import { createSlice } from "@reduxjs/toolkit";
import {
  getAdmin, loginAdmin, createAdmin, logoutAdmin
} from "./auth.thunks";


const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};


const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    builder

      // LOGIN ADMIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })

      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

    builder

      // create ADMIN
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

    builder
      // GET ADMIN
      .addCase(getAdmin.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(getAdmin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

    builder

      // LOGOUT ADMIN
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});


export const { clearError } = authSlice.actions;


export default authSlice.reducer;