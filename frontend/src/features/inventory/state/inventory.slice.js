import { createSlice } from "@reduxjs/toolkit";

import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "./inventory.thunks";


const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};


const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },


  extraReducers: (builder) => {
    // ================= GET INVENTORY =================
    builder
      .addCase(getInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })


      .addCase(getInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(getInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ================= CREATE INVENTORY =================
    builder
      .addCase(createInventory.pending, (state) => {
        state.loading = true;
      })

      .addCase(createInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })


      .addCase(createInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



    // ================= UPDATE INVENTORY =================

    builder
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
      })


      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload.data;
        const index = state.items.findIndex(
          (item) =>
            item.productId === updatedItem.productId
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })


      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



    // ================= DELETE INVENTORY =================
    builder
      .addCase(deleteInventory.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) =>
            item.productId !== action.payload.data.productId
        );
      })


      .addCase(deleteInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});


export const {
  clearSelectedItem,
} = inventorySlice.actions;

export default inventorySlice.reducer;