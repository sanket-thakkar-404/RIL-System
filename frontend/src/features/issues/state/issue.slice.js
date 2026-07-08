import { createSlice } from "@reduxjs/toolkit";
import {
  createIssue,
  getIssue,
  getIssueStatus,
  updateIssueStatus,
} from "./issue.thunks.js";


const initialState = {
  issues: [],
  selectedIssues: null,
  loading: false,
  error: null,
};

const issueSlice = createSlice({
  name: "issue",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // ================= CREATE ISSUE =================
    builder
      .addCase(createIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues.push(action.payload);
      })

      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ================= GET ALL ISSUES =================
    builder
      .addCase(getIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload?.issues;
        // console.log(action.payload?.data?.issues)
      })

      .addCase(getIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ================= GET SINGLE ISSUE STATUS =================
    builder
      .addCase(getIssueStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedIssues = null;
      })

      .addCase(getIssueStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIssues = action.payload;
      })

      .addCase(getIssueStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ================= UPDATE STATUS =================
    builder
      .addCase(updateIssueStatus.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIssue = action.payload;
        // console.log(action.payload);

        // console.log(Array.isArray(state.issues));

        // console.log(state.issues);

        if (updatedIssue && updatedIssue.requestId) {
          const index = state.issues.findIndex(
            (issue) => issue.requestId === updatedIssue.requestId
          );

          // console.log(state.issues.requestId)

          if (index !== -1) {
            state.issues[index] = updatedIssue;
          }
          state.selectedIssues = updatedIssue;
        }
      })

      .addCase(updateIssueStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default issueSlice.reducer;