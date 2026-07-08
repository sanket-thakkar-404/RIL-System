import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAPI, logoutAPI, registerAPI, getAPI
} from "../apis/auth.apis.js";


// LOGIN ADMIN
export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginAPI(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  }
);

export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerAPI(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  }
);



// GET ADMIN PROFILE
export const getAdmin = createAsyncThunk(
  "admin/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Admin fetch failed"
      );
    }
  }
);


// LOGOUT ADMIN
export const logoutAdmin = createAsyncThunk(
  "admin/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Logout failed"
      );

    }
  }
);