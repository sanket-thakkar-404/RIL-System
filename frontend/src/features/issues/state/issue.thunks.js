import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createIssueAPI,
  getIssueAPI,
  getIssueStatusAPI,
  updateIssueStatusAPI,
} from "../apis/issue.apis";


// CREATE ISSUE
export const createIssue = createAsyncThunk(
  "issue/create",
  async (issueData, { rejectWithValue }) => {
    try {
      const response = await createIssueAPI(issueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// GET ALL ISSUES
export const getIssue = createAsyncThunk(
  "issue/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIssueAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// GET ISSUE STATUS
export const getIssueStatus = createAsyncThunk(
  "issue/status",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await getIssueStatusAPI(requestId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// UPDATE ISSUE STATUS
export const updateIssueStatus = createAsyncThunk(
  "issue/updateStatus",
  async ({ requestId, data }, { rejectWithValue }) => {
    try {
      const response = await updateIssueStatusAPI(
        requestId,
        data
      );
      console.log("UPDATE RESPONSE", response.data);

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);