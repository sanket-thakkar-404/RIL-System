import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/state/auth.slice";
import issueReducer from "../features/issues/state/issue.slice";
import inventoryReducer from "../features/inventory/state/inventory.slice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    issue: issueReducer,
    inventory: inventoryReducer,
  },
});


export default store;