# RIL System — Improvement & Optimization Guide

This document outlines actionable strategies to improve, optimize, and scale the **RIL Inventory & Issue Control System**. It is divided into key areas: Performance, Security, Architecture, Code Quality, and Missing Features.

---

## 1. Performance Optimizations (Speed & Efficiency)

### Backend (Node.js & MongoDB)
*   **Server-Side Pagination:** Currently, `GET /api/issues/` returns *all* issues from the database. As the system grows, this will consume excessive memory and slow down the API. 
    *   **Action:** Implement pagination in `issue.controller.js` and `issue.service.js` using `limit` and `skip`. (e.g., `GET /api/issues?page=1&limit=20`).
*   **Database Indexing:** The `requestId` and `status` fields in the `Issues` collection are queried frequently.
    *   **Action:** Add indexes in `issue.model.js`: `schema.index({ requestId: 1 })` and `schema.index({ status: 1 })` to drastically speed up read operations.
*   **Response Compression:** The API responses are sent uncompressed.
    *   **Action:** Install and use the `compression` middleware in Express to gzip responses, reducing payload size.
*   **Google Sheets Batch Updates:** In `updateStatusLogic` (when receiving items), you are updating the stock cells sequentially.
    *   **Action:** Use Google Sheets API's `batchUpdate` to send a single request to update multiple stock cells at once, reducing network overhead and avoiding potential API rate limits.

### Frontend (React & Vite)
*   **Component Lazy Loading:** The entire React app is bundled together. Admin pages shouldn't load for public users.
    *   **Action:** Use `React.lazy()` and `<Suspense>` in `AppRoutes.jsx` to split the code (e.g., lazy load `DashboardLayout` and all admin pages).
*   **Intelligent Caching:** The frontend currently refetches data on component mount.
    *   **Action:** Leverage Redux Toolkit Query (RTK Query) or implement logic to skip fetching if `state.inventory.items` already has data (and isn't stale), reducing unnecessary API calls.
*   **Memoization:** Prevent unnecessary re-renders in complex views like `RequestPage` and `StockPage`.
    *   **Action:** Use `React.useMemo` for derived data (like filtering approved/received lists) and `React.useCallback` for functions passed as props.

---

## 2. Security Enhancements

*   **Implement Rate Limiting:** Protect your authentication endpoints from brute-force attacks.
    *   **Action:** Use `express-rate-limit` on the `/api/admin/login` and `/api/admin/create` routes.
*   **NoSQL Injection Prevention:** Prevent malicious queries.
    *   **Action:** Install and configure `express-mongo-sanitize` to strip out keys containing `$` or `.` from req.body, req.query, and req.params.
*   **Secure HTTP Headers:** Protect against XSS, clickjacking, and other common exploits.
    *   **Action:** Add the `helmet` package to your Express middleware stack.
*   **Role-Based Access Control (RBAC):** The `Admin` model has a `role` field (`admin` vs `user`), but all authenticated users currently have the same permissions.
    *   **Action:** Create a `requireRole("admin")` middleware to protect sensitive routes (like creating other admins or modifying core inventory).
*   **Remove Hardcoded Secrets/Emails:** 
    *   **Action:** The store manager email (`purchase@rotocastgroup.com`) is hardcoded in `issue.service.js`. Move this to the `.env` file (e.g., `STORE_MANAGER_EMAIL`).
*   **Strict CORS Policy:** Ensure that in production, only your specific frontend domain is allowed to access the API.

---

## 3. Architecture & Scalability

*   **Move Hardcoded Frontend Config:** The Axios `baseURL` is hardcoded to `http://localhost:3002/api`.
    *   **Action:** Use Vite environment variables. Create a `.env` in the frontend folder with `VITE_API_URL=http://localhost:3002/api` and update `axiosInstance.js` to use `import.meta.env.VITE_API_URL`.
*   **Separate Deployment:** Currently, the frontend seems intended to be served by the backend or run alongside it.
    *   **Action:** Deploy the React frontend independently (e.g., on Vercel, Netlify, or AWS S3/CloudFront) and the Node backend on a separate service (e.g., Render, Railway, AWS EC2) for better scalability.
*   **Real-time Updates (Optional):** Admins currently have to refresh the page to see new requests.
    *   **Action:** Integrate `Socket.io` or Server-Sent Events (SSE) to push new issue notifications to the admin dashboard in real-time.
*   **API Versioning:** Future-proof the backend.
    *   **Action:** Prefix routes with a version (e.g., `/api/v1/issues`) so you can make breaking changes in the future without breaking existing clients.

---

## 4. Code Quality & Maintainability

*   **TypeScript Migration:** JavaScript lacks compile-time type checking, leading to runtime errors.
    *   **Action:** Gradually migrate the codebase to TypeScript. Start with backend models and frontend Redux slices to define strict data shapes.
*   **Automated Testing:** There are currently no tests.
    *   **Action:** Set up **Jest** and **Supertest**. Start by writing integration tests for your most critical logic: `updateStatusLogic` in `issue.service.js` (testing the APPROVE and RECEIVE flows).
*   **Populate References:** In `ApprovedRequestPage`, the approver is hardcoded as "Admin".
    *   **Action:** The `Issue` model stores `approvedBy` (ObjectId of Admin). Update `getIssueLogic` to use `.populate('approvedBy', 'fullname')` so the frontend can display the actual admin's name.
*   **Standardize Naming:** Ensure consistency across folders (e.g., you have `features/auth/hook` [singular] but `features/issues/hooks` [plural]).

---

## 5. Missing Features to Complete

*   **Inventory Controller Stubs:** The backend `inventory.controller.js` has empty/incomplete functions for creating and updating inventory items.
    *   **Action:** Implement `createInventoryLogic` and `updateInventoryLogic` in the service layer to sync changes back to Google Sheets.
*   **Admin Management UI:** Currently, admins must be created via API tools like Postman.
    *   **Action:** Build an Admin Settings page in the frontend to list, create, and remove admin accounts.
*   **Rejection Reasoning:** When an admin rejects a request, there is no way to tell the user *why*.
    *   **Action:** Update the UI to prompt for a "Rejection Reason", save it to the DB, and include it in the `rejectedMailTemplate`.
*   **Purchase Page Implementation:** `PurchasePage.jsx` exists in the frontend but isn't fully wired to a complete backend flow.
    *   **Action:** Connect this page to the completed `createInventory` / `updateInventory` endpoints.

---

### Priority Checklist for Next Sprint

1. [ ] Move `baseURL` in frontend to `.env` (`VITE_API_URL`).
2. [ ] Add `express-rate-limit` and `helmet` to backend.
3. [ ] Implement Server-Side Pagination for `/api/issues`.
4. [ ] Add MongoDB indexes for `requestId`.
5. [ ] Refactor `purchase@rotocastgroup.com` to an environment variable.
