import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getInventoryAPI,
  createInventoryAPI,
  updateInventoryAPI,
  deleteInventoryAPI,
} from "../apis/inventory.apis";



// ================= GET INVENTORY =================
export const getInventory = createAsyncThunk(
  "inventory/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getInventoryAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// ================= CREATE INVENTORY =================
export const createInventory = createAsyncThunk(
  "inventory/create",
  async (inventoryData, { rejectWithValue }) => {
    try {
      const response = await createInventoryAPI(
        inventoryData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// ================= UPDATE INVENTORY =================
export const updateInventory = createAsyncThunk(
  "inventory/update",
  async (
    { productId, data },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await updateInventoryAPI(
          productId,
          data
        );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// ================= DELETE INVENTORY =================
export const deleteInventory = createAsyncThunk(
  "inventory/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const response =
        await deleteInventoryAPI(productId);
      return response.data;
    } catch (error) {

      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);