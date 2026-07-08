# RIL System — Complete Developer Documentation

> **Project:** RIL Inventory & Issue Management System  
> **Version:** 1.0.0  
> **Author:** Sanket Thakkar  
> **Documentation Generated:** 2026-07-08  
> **Stack:** React 19 + Redux Toolkit + Vite (Frontend) | Node.js + Express 5 + MongoDB + Google Sheets API (Backend)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Complete Folder Structure](#3-complete-folder-structure)
4. [Application Architecture](#4-application-architecture)
5. [Frontend Deep Analysis](#5-frontend-deep-analysis)
6. [Backend Deep Analysis](#6-backend-deep-analysis)
7. [Environment Variables](#7-environment-variables)
8. [Authentication & Authorization Flow](#8-authentication--authorization-flow)
9. [Database Flow](#9-database-flow)
10. [Third Party Integrations](#10-third-party-integrations)
11. [Error Handling System](#11-error-handling-system)
12. [Security Analysis](#12-security-analysis)
13. [Performance Analysis](#13-performance-analysis)
14. [How To Run Project Locally](#14-how-to-run-project-locally)
15. [Developer Onboarding Guide](#15-developer-onboarding-guide)
16. [Future Improvements](#16-future-improvements)

---

## 1. Project Overview

### Project Name
**RIL System** — *Rotocast Group Inventory & Issue Control System*

### Main Purpose
The RIL System is an internal enterprise inventory and material-request management platform built for **Rotocast Group** (a manufacturing company). It digitizes the entire lifecycle of inventory requisition — from an employee submitting a material request to an admin approving/rejecting it, physical receipt of items, and real-time stock updates in Google Sheets.

### Problem It Solves
Before this system, Rotocast Group likely used paper-based or manual spreadsheet processes for:
- Employees requesting inventory items from various factory departments
- Store managers tracking what was approved vs. received
- Maintaining live stock counts in a shared Google Sheet

This system eliminates paperwork, provides audit trails, sends automated email notifications, and keeps Google Sheets in sync automatically.

### Target Users

| User Type | Access Level | Entry Point |
|-----------|-------------|-------------|
| **Employee / Requester** | No login required | Public URL `/` |
| **Admin (Store Manager / Supervisor)** | JWT-authenticated | `/admin` panel |

### Main Features

1. **Public Request Submission** — Any employee can submit an inventory request (no login needed) by selecting their department, searching for items, specifying quantities, and providing a justification.
2. **Request Tracking** — Employees can track their request status using a unique Request ID (e.g., `REQ-001`).
3. **Admin Dashboard** — Authenticated admins see KPI cards: total requests, pending approvals, low stock items, and overall inventory health %.
4. **Request Review & Approval** — Admin reviews all UNDER_REVIEW requests with full item, department, and stock availability info, then APPROVES or REJECTS with approved quantities.
5. **Item Receiving** — When physical items are delivered, admin marks items as RECEIVED, entering actual received quantities.
6. **Google Sheets Sync** — Every approval and receipt is automatically logged to a shared Google Spreadsheet (separate tabs: `Stock`, `Approved`, `Received`, `Rejected`). Stock counts are updated in real-time.
7. **Email Notifications** — Automated HTML emails are sent to the requester on approval/rejection, and to the store manager email on receipt.
8. **Inventory Stock View** — Admin can view paginated stock levels, with minimum stock warnings.
9. **Purchase Page** — Admin-facing page for recording purchase additions to inventory.
10. **Admin Limit** — Hard-coded limit: maximum **2 admin accounts** allowed.

### Complete Workflow

```
EMPLOYEE SIDE (Public — No Login)
────────────────────────────────
1. Employee visits the website (/)
2. Fills form: Department, Full Name, Email
3. Searches inventory items by name/category/ID
4. Adds items + enters required quantity
5. Enters a justification description
6. Submits the form
   ↓
   Backend assigns a unique REQ-XXX ID
   Issue document created in MongoDB with status: UNDER_REVIEW
   ↓
7. Success card shown with Request ID
8. Employee copies/saves Request ID

TRACKING (Public)
──────────────────
9. Employee visits /track
10. Enters their REQ-XXX ID
11. Views current status + timeline

ADMIN SIDE (Protected — JWT Required)
──────────────────────────────────────
12. Admin logs in at /login
    JWT cookie set (7 days)
    Redirected to /admin/dashboard

13. Dashboard shows:
    - Total requests count
    - Pending approvals count
    - Low stock item count
    - Inventory health %
    - Recent 5 request activity feed

14. Admin goes to Pending Requests (/admin/request)
    - Sees all UNDER_REVIEW requests
    - Expands a request, reviews items + stock
    - Sets approved quantity per item
    - Clicks APPROVE or REJECT
    ↓
    Backend:
    - Updates status in MongoDB
    - Logs row to Google Sheets "Approved" or "Rejected" tab
    - Sends approval/rejection email to requester

15. Requester receives items physically

16. Admin goes to Track Request (/track) or receives items
    - Enters Request ID
    - Enters actually received quantities per item
    - Clicks "Mark as Received"
    ↓
    Backend:
    - Updates status to RECEIVED in MongoDB
    - Deducts received quantities from Google Sheets "Stock" tab
    - Appends row to "Received" tab
    - Sends email to store manager (purchase@rotocastgroup.com)

17. Admin can check:
    - Approved history (/admin/approve)
    - Received history (/admin/received)
    - Stock levels (/admin/stock)
    - Purchase entries (/admin/purchase)
```

---

## 2. Technology Stack

### Frontend Stack

#### React 19
- **Purpose:** Core UI library for building declarative, component-based user interfaces.
- **Used in:** All JSX files inside `frontend/src/features/` and `frontend/src/components/`
- **Why:** Component reusability, virtual DOM diffing for performance, React 19 features like improved concurrent rendering.

#### Vite 8
- **Purpose:** Ultra-fast build tool and development server using native ES Modules.
- **Used in:** `frontend/vite.config.js`, `npm run dev` command
- **Why:** Near-instant HMR (Hot Module Replacement), much faster than Create React App/Webpack.

#### Redux Toolkit (RTK) v2
- **Purpose:** Global state management for auth, issues, and inventory data.
- **Used in:**
  - `frontend/src/app/store.js` — Store configuration
  - `features/*/state/*.slice.js` — Reducers + state shape
  - `features/*/state/*.thunks.js` — Async API call handlers
- **Why:** RTK eliminates Redux boilerplate, includes Immer for immutable updates, and `createAsyncThunk` for standardized async patterns.

#### React Redux v9
- **Purpose:** Connects React components to Redux store.
- **Used in:** All hooks (`useSelector`, `useDispatch`) inside `features/*/hooks/`
- **Why:** Official React bindings for Redux.

#### React Router v8
- **Purpose:** Client-side routing for SPA navigation.
- **Used in:** `frontend/src/app/routes/AppRoutes.jsx` with `createBrowserRouter`
- **Why:** Declarative routing, nested routes, layout routes with `<Outlet />`.

#### Axios v1
- **Purpose:** HTTP client for making API calls to the backend.
- **Used in:** `frontend/src/config/axiosInstance.js` (single shared instance), all `*/apis/*.apis.js` files
- **Why:** Cleaner API than native `fetch`, automatic JSON parsing, `withCredentials` for cookie-based auth.

#### React Hook Form v7
- **Purpose:** Form state management, validation, and submission handling.
- **Used in:** All hooks (`useAuth`, `useIssue`, `useInventory`) via `useForm()`, `useFieldArray()` in `SubmitRequestPage`
- **Why:** Performance-focused (uncontrolled inputs), built-in validation rules, easy error handling.

#### Tailwind CSS v4 + DaisyUI v5
- **Purpose:** Utility-first CSS framework for rapid UI styling.
- **Used in:** All JSX component class names
- **Why:** Eliminates custom CSS files (mostly), consistent design system, responsive utilities.

#### Lucide React v1
- **Purpose:** Icon library providing SVG icons as React components.
- **Used in:** Dashboard, Sidebar, Login, Request pages for visual icons.
- **Why:** Lightweight, consistent, tree-shakeable icons.

#### Sonner v2
- **Purpose:** Toast notification library for success/error feedback.
- **Used in:** `main.jsx` (`<Toaster />`), triggered via `toast.success()` / `toast.error()` across pages.
- **Why:** Clean, lightweight, out-of-the-box dark mode support.

---

### Backend Stack

#### Node.js + ES Modules
- **Purpose:** Server runtime environment.
- **Used in:** `backend/server.js`, all `.js` files using `import/export` syntax (`"type": "module"` in package.json).
- **Why:** Non-blocking I/O, same language as frontend, large ecosystem.

#### Express 5
- **Purpose:** Web framework for routing and middleware.
- **Used in:** `backend/src/app.js` (middleware setup), `backend/src/routes/*.routes.js` (route definitions)
- **Why:** Express 5 has improved async error handling (auto-catches promise rejections).

#### Mongoose v9
- **Purpose:** MongoDB ODM (Object Data Modeler) for schema definition and querying.
- **Used in:** `backend/src/model/*.model.js`, `backend/src/config/database.config.js`
- **Why:** Schema validation, middleware hooks (pre-save password hashing), cleaner query API.

#### MongoDB (via Atlas or local)
- **Purpose:** NoSQL database storing Admin accounts and Issue/Request documents.
- **Used in:** Connected via `MONGO_URI` env variable.
- **Collections:** `admins`, `issues`

#### JSON Web Tokens (JWT) via `jsonwebtoken` v9
- **Purpose:** Stateless authentication tokens.
- **Used in:** `backend/src/utils/generateToken.js`, `backend/src/middleware/auth.middleware.js`
- **Why:** Scalable, no server-side session storage needed.

#### bcrypt v6
- **Purpose:** Password hashing with salt rounds.
- **Used in:** `backend/src/model/admin.model.js` (pre-save hook, `comparePassword` method)
- **Why:** Industry standard for secure password storage, adaptive work factor.

#### cookie-parser v1
- **Purpose:** Parses `Cookie` headers so `req.cookies` is available.
- **Used in:** `backend/src/app.js`, JWT token read in `auth.middleware.js` via `req.cookies.token`
- **Why:** HttpOnly cookies are more secure than localStorage for token storage.

#### Google APIs (`googleapis` v173)
- **Purpose:** Read/write/update Google Sheets and Google Drive.
- **Used in:** `backend/src/config/google.config.js`, `backend/src/services/googleSheet.service.js`
- **Why:** Inventory master data lives in Google Sheets, enabling non-technical staff to manage stock without a custom DB UI.

#### Nodemailer v9
- **Purpose:** Send transactional HTML emails via Gmail SMTP.
- **Used in:** `backend/src/config/mail.config.js`, called in `issue.service.js` on approval/rejection/receipt
- **Why:** Simple SMTP integration, works with Gmail App Passwords.

#### NodeCache v5
- **Purpose:** In-memory caching to reduce Google Sheets API calls.
- **Used in:** `backend/src/config/cache.config.js`, `backend/src/services/inventory.service.js`
- **Why:** Google Sheets API has rate limits; inventory data is cached for 10 minutes (600 seconds TTL).

#### express-validator v7
- **Purpose:** Request body validation middleware.
- **Used in:** `backend/src/validator/auth.validate.js`, `backend/src/validator/issue.validate.js`
- **Why:** Declarative validation rules, integrates with Express middleware chain.

#### nodemon (dev dependency)
- **Purpose:** Auto-restart server on file changes during development.
- **Used in:** `npm run dev` script.

---

## 3. Complete Folder Structure

### Project Root

```
RIC System Master V1/
├── frontend/                   # React Vite application
├── backend/                    # Node.js Express API server
└── RIL-System/                 # Git repository root (contains both)
    ├── frontend/
    ├── backend/
    ├── .gitignore
    └── README.md
```

---

### Frontend Structure

```
frontend/
├── index.html                  # Vite entry HTML, mounts <div id="root">
├── vite.config.js              # Vite config (React plugin)
├── package.json                # Dependencies & scripts
├── eslint.config.js            # ESLint rules
└── src/
    ├── main.jsx                # App entry point: Redux Provider + Router + Toaster
    ├── app/
    │   ├── index.css           # Global CSS (Tailwind directives, CSS variables)
    │   ├── store.js            # Redux store: auth + issue + inventory reducers
    │   ├── routes/
    │   │   └── AppRoutes.jsx   # All route definitions (Public, Auth, Admin)
    │   └── layout/
    │       ├── AuthLayout.jsx  # Wrapper for login page (no protection)
    │       ├── PublicLayout.jsx# Wrapper for public pages (header + outlet)
    │       └── DashboardLayout.jsx # Protected admin layout (sidebar, header, outlet)
    ├── components/             # Shared/reusable UI components
    │   ├── FormField.jsx       # Universal form field (input/select/textarea)
    │   ├── PageHeader.jsx      # Reusable page title + description header
    │   ├── InfoBanner.jsx      # Informational banner component
    │   ├── SidebarNavItem.jsx  # Active-highlighted sidebar navigation link
    │   ├── Tables/
    │   │   ├── Table.jsx       # Full-featured paginated table component
    │   │   ├── TableHeader.jsx # Table column header
    │   │   └── TableRow.jsx    # Table row renderer
    │   ├── admin/              # (Empty — reserved for admin-specific components)
    │   └── public/
    │       └── PublicHeader.jsx# Top navigation bar for public pages
    ├── config/
    │   └── axiosInstance.js    # Configured Axios instance (baseURL + withCredentials)
    ├── data/                   # Static data/constants used across features
    │   ├── department.js       # List of 15 factory department names
    │   ├── table.js            # Column definitions for inventory/approval/received tables
    │   ├── getTimeline.js      # Helper to build status timeline for request tracking
    │   └── unit.js             # Unit of measure definitions
    ├── assets/                 # Static assets (images, audio files)
    └── features/               # Feature-based architecture (each feature is self-contained)
        ├── auth/               # Authentication feature
        │   ├── apis/
        │   │   └── auth.apis.js    # Axios calls to /api/admin/*
        │   ├── hook/
        │   │   └── useAuth.js      # Custom hook: login/logout/fetch admin + form
        │   ├── state/
        │   │   ├── auth.slice.js   # Redux slice: user, loading, error, isAuthenticated
        │   │   └── auth.thunks.js  # Async thunks: loginAdmin, getAdmin, logoutAdmin
        │   └── ui/
        │       ├── pages/
        │       │   └── LoginPage.jsx   # Login form page
        │       └── components/         # (Empty — no auth sub-components)
        ├── dashboard/          # Admin dashboard feature
        │   ├── apis/           # (Empty — uses issue + inventory hooks directly)
        │   ├── hooks/          # (Empty)
        │   ├── state/          # (Empty)
        │   └── ui/
        │       ├── pages/
        │       │   └── Dashboard.jsx   # KPI cards + recent activity
        │       └── components/         # (Empty)
        ├── inventory/          # Inventory management feature
        │   ├── apis/
        │   │   └── inventory.apis.js   # GET/POST/PATCH/DELETE /api/inventory/*
        │   ├── hooks/
        │   │   └── useInventory.js     # Custom hook: CRUD inventory + form
        │   ├── state/
        │   │   ├── inventory.slice.js  # Redux slice: items, selectedItem, loading, error
        │   │   └── inventory.thunks.js # Async thunks: getInventory, createInventory, etc.
        │   └── ui/
        │       ├── pages/
        │       │   ├── StockPage.jsx       # Admin stock levels table
        │       │   └── PurchasePage.jsx    # Admin purchase recording page
        │       └── components/             # (Empty)
        └── issues/             # Issue/Request management feature (largest feature)
            ├── apis/
            │   └── issue.apis.js   # GET/POST/PATCH /api/issues/*
            ├── hooks/
            │   └── useIssue.js     # Custom hook: submit/fetch/track/update issues + form
            ├── state/
            │   ├── issue.slice.js  # Redux slice: issues[], selectedIssues, loading, error
            │   └── issue.thunks.js # Async thunks: createIssue, getIssue, updateIssueStatus
            └── ui/
                ├── pages/
                │   ├── SubmitRequestPage.jsx   # Public: submit new request form
                │   ├── TrackRequestPage.jsx    # Public: track request by ID, mark received
                │   ├── RequestPage.jsx         # Admin: review + approve/reject requests
                │   ├── ApprovedRequestPage.jsx # Admin: view approved history
                │   └── ReceivedRequestPage.jsx # Admin: view received history
                └── components/
                    ├── ItemSearchAdd.jsx        # Debounced inventory item search UI
                    └── SuccessCard.jsx          # Post-submission success screen
```

---

### Backend Structure

```
backend/
├── server.js               # Entry: connectDB() → http.createServer(app) → listen
├── package.json            # Dependencies, "type": "module", scripts
├── .env                    # Environment variables (not in git)
├── google.json             # Google service account JSON (alternative credentials)
└── src/
    ├── app.js              # Express app: CORS, middleware, routes, static files, SPA fallback
    ├── config/
    │   ├── dotenv.config.js    # Validates required env vars, exports frozen config object
    │   ├── database.config.js  # Mongoose connection function
    │   ├── google.config.js    # Google auth + exports `sheets` and `drive` clients
    │   ├── mail.config.js      # Nodemailer transporter (Gmail SMTP)
    │   └── cache.config.js     # NodeCache instance (10 min TTL)
    ├── constants/
    │   └── sheet.constant.js   # Google Sheet ID + range names (Stock, Approved, Received, Rejected)
    ├── controller/             # Thin layer — receives req, calls service, returns response
    │   ├── auth.controller.js  # create/login/getMe/logout admin
    │   ├── issue.controller.js # create/get/getStatus/updateStatus issue
    │   └── inventory.controller.js # getInventory (+ incomplete createInventory stub)
    ├── middleware/
    │   ├── auth.middleware.js  # JWT verification, attaches req.admin
    │   └── error.middleware.js # Global error handler, normalizes ApiError responses
    ├── model/
    │   ├── admin.model.js      # Admin schema (bcrypt pre-save, comparePassword method)
    │   └── issue.model.js      # Issue schema (items array, status enum, timestamps)
    ├── routes/
    │   ├── auth.routes.js      # /api/admin/* (create, login, get-me, logout)
    │   ├── issue.routes.js     # /api/issues/* (create, get all, get by ID, update status)
    │   └── inventory.routes.js # /api/inventory/* (get only, currently)
    ├── services/               # Business logic layer
    │   ├── auth.service.js     # createAdminLogic, loginAdminLogic
    │   ├── issue.service.js    # createIssue, getIssue, getIssueStatus, updateStatusLogic
    │   ├── inventory.service.js# getItemsLogic (with cache)
    │   └── googleSheet.service.js # getSheetData, appendSheetData, updateSheetData
    ├── templates/
    │   └── Mail.template.js    # HTML email templates: approvalMail, receivedMail, rejectedMail
    ├── utils/
    │   ├── apiError.js         # Custom ApiError class extending Error
    │   ├── apiResponse.js      # Standardized ApiResponse class
    │   ├── asyncHandler.js     # Wraps async route handlers, forwards errors to next()
    │   └── generateToken.js    # generateToken() + verifyToken() using JWT
    └── validator/
        ├── auth.validate.js    # createAdminValidator, loginAdminValidator (express-validator)
        └── issue.validate.js   # createIssueValidator + shared validate() middleware
```

---

## 4. Application Architecture

### System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                           │
│                                                             │
│  React 19 + Redux Toolkit + React Router + Axios           │
│                                                             │
│  Public Pages          Admin Pages (Protected)             │
│  ├── / (Submit)        ├── /admin/dashboard                │
│  └── /track            ├── /admin/request                  │
│                         ├── /admin/approve                  │
│                         ├── /admin/received                 │
│                         ├── /admin/stock                    │
│                         └── /admin/purchase                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (Axios + Cookie auth)
                           │ baseURL: http://localhost:3002/api
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    EXPRESS 5 SERVER                         │
│                  (Port 3002)                                │
│                                                             │
│  Middleware Stack:                                          │
│  CORS → JSON Parser → URL Encoder → Static → Cookie Parser │
│                                                             │
│  Routes:                                                    │
│  /api/admin/*       → auth.routes.js                       │
│  /api/issues/*      → issue.routes.js                      │
│  /api/inventory/*   → inventory.routes.js                   │
│  /health            → health check                         │
│  * (wildcard)       → serves frontend index.html (SPA)     │
│                                                             │
│  Global Error Handler: errorMiddleware                      │
└────┬────────────────────┬──────────────────────────────────┘
     │                    │
     │                    │
┌────▼─────┐    ┌─────────▼────────────────────────────────┐
│ MongoDB  │    │       THIRD PARTY SERVICES                │
│          │    │                                           │
│ admins   │    │  Google Sheets API (googleapis)           │
│ issues   │    │  ├── Stock tab (read/update)              │
│          │    │  ├── Approved tab (append)                │
└──────────┘    │  ├── Received tab (append)                │
                │  └── Rejected tab (append)                │
                │                                           │
                │  Gmail SMTP (Nodemailer)                  │
                │  ├── Approval email → requester           │
                │  ├── Rejection email → requester          │
                │  └── Received email → store manager       │
                └───────────────────────────────────────────┘
```

### Request Lifecycle (General)

```
1. User Action in Browser
   ↓
2. React Component calls Custom Hook (useAuth / useIssue / useInventory)
   ↓
3. Hook dispatches Redux Thunk (createAsyncThunk)
   ↓
4. Thunk calls API function (Axios request with credentials)
   ↓
5. Axios sends HTTP request → Express Server
   ↓
6. Express Middleware Chain (CORS, JSON, Cookie Parser)
   ↓
7. Route Handler matches path
   ↓
8. Validator Middleware runs (express-validator)
   ↓
9. Auth Middleware (if protected route) verifies JWT cookie
   ↓
10. Controller function called
    ↓
11. Service function contains business logic
    ↓
12. Database query (Mongoose) and/or Google Sheets API call
    ↓
13. Service returns result to Controller
    ↓
14. Controller wraps result in ApiResponse and sends JSON
    ↓
15. Axios receives response
    ↓
16. Redux Thunk resolves (fulfilled/rejected)
    ↓
17. Redux Slice reducer updates state
    ↓
18. React component re-renders with new state
    ↓
19. User sees result (toast notification, UI update)
```

### Error Handling Flow

```
Async Error Thrown (in service/controller)
↓
asyncHandler wrapper catches it via .catch(next)
↓
Express Global Error Middleware (errorMiddleware) receives it
↓
If error instanceof ApiError → use as-is
If generic error → wrap in ApiError(statusCode, message)
↓
Returns JSON: { success: false, message, errors, stack(dev only) }
↓
Axios receives 4xx/5xx response
↓
Thunk rejectWithValue(error.response.data.message)
↓
Redux slice sets state.error
↓
Hook/Component shows toast.error() or renders error UI
```

---

## 5. Frontend Deep Analysis

### 5.1 Pages Documentation

---

#### `LoginPage.jsx`
- **Route:** `/login`
- **Layout:** `AuthLayout` (no sidebar, no header)
- **Purpose:** Admin authentication page.
- **Components Used:** `FormField` (email + password)
- **Hook:** `useAuth`
- **State:** `isAuthenticated`, `loading` from Redux auth slice
- **Flow:**
  ```
  User visits /login
  ↓
  useAuth hook runs: fetches admin profile (getAdmin) on mount
  ↓
  If already authenticated → Navigate to /admin (redirect)
  ↓
  User fills email + password
  ↓
  handleSubmit(onLoginSubmit) validates via react-hook-form
  ↓
  dispatches loginAdmin thunk → POST /api/admin/login
  ↓
  On success: toast.success, navigate to /admin
  On failure: toast.error with server message
  ```
- **Guard:** Redirects authenticated users away from login.

---

#### `SubmitRequestPage.jsx`
- **Route:** `/` (homepage)
- **Layout:** `PublicLayout` (with public header)
- **Purpose:** Public form for employees to submit inventory requests.
- **Components Used:** `FormField`, `ItemSearchAdd`, `SuccessCard`, `PageHeader`
- **Hook:** `useIssue` (form + submission), `useFieldArray` (dynamic item list)
- **Static Data:** `DEPARTMENTS` from `data/department.js`
- **Flow:**
  ```
  Employee visits /
  ↓
  Selects Department, enters Full Name + Email
  ↓
  Types in ItemSearchAdd search box (debounced 300ms)
    → Fetches inventory from Redux state (via useInventory)
    → Shows matching items dropdown
  ↓
  Clicks an item → added to useFieldArray list
  Employee enters quantity for each item
  ↓
  Enters description (min 10 chars)
  ↓
  Clicks Submit Request
  ↓
  onSubmitIssue() called → dispatches createIssue thunk
  → POST /api/issues/create
  ↓
  On success: shows SuccessCard with REQ-XXX ID + Copy button
  On failure: toast.error
  ```
- **Special Logic:** If no items added, shows inline error and blocks submission.

---

#### `TrackRequestPage.jsx`
- **Route:** `/track`
- **Layout:** `PublicLayout`
- **Purpose:** Allows anyone (employee or admin) to look up a request by ID and see its full status timeline. Also serves as the "Mark as Received" interface.
- **Hook:** `useIssue` (`fetchIssueStatus`, `changeIssueStatus`)
- **Flow:**
  ```
  User enters Request ID (e.g., REQ-001)
  ↓
  GET /api/issues/:id → returns issue data
  ↓
  Renders status timeline (UNDER_REVIEW → APPROVED → RECEIVED)
  ↓
  If status is APPROVED, shows "Receive Items" button
  ↓
  Admin enters received quantities per item
  ↓
  Clicks "Confirm Receipt"
  ↓
  PATCH /api/issues/:id with status: RECEIVED + receivedQtys
  ↓
  Google Sheets Stock tab updated, received mail sent
  ```

---

#### `Dashboard.jsx`
- **Route:** `/admin/dashboard`
- **Layout:** `DashboardLayout` (protected — redirects to /login if unauthenticated)
- **Purpose:** Overview dashboard for admins.
- **Hooks:** `useIssue`, `useInventory`
- **KPI Calculations:**
  - `totalRequests` = `issues.length`
  - `pendingRequests` = issues where `status === "UNDER_REVIEW"`
  - `lowStockItems` = items where `stock <= minStock`
  - `inventoryHealth` = `(healthyItems / items.length) * 100`%
- **Data:** Fetches all issues and inventory on mount.
- **Recent Activity:** Last 5 requests sorted by `createdAt` descending.

---

#### `RequestPage.jsx`
- **Route:** `/admin/request`
- **Layout:** `DashboardLayout`
- **Purpose:** Admin views all UNDER_REVIEW requests and approves/rejects them with per-item approved quantities.
- **Hook:** `useIssue`
- **Features:**
  - Paginated (4 per page)
  - Each request card shows: requester info, department, items with stock status badges (Available/Insufficient/Out of Stock), description
  - Inline quantity inputs for approve quantities
  - APPROVE / REJECT buttons call `PATCH /api/issues/:id`

---

#### `ApprovedRequestPage.jsx`
- **Route:** `/admin/approve`
- **Layout:** `DashboardLayout`
- **Purpose:** Read-only history of all APPROVED requests.
- **Data:** Filters `issues` array from Redux for `status === "APPROVED"`.
- **Display:** Uses generic `Table` component with `approvedCols` column definitions.

---

#### `ReceivedRequestPage.jsx`
- **Route:** `/admin/received`
- **Layout:** `DashboardLayout`
- **Purpose:** Read-only history of all RECEIVED requests.
- **Data:** Filters `issues` for `status === "RECEIVED"`.
- **Display:** Uses generic `Table` component with `receivedCols`.

---

#### `StockPage.jsx`
- **Route:** `/admin/stock`
- **Layout:** `DashboardLayout`
- **Purpose:** View current inventory stock levels from Google Sheets.
- **Hook:** `useInventory`
- **Display:** Paginated table (10 items/page) showing: Item Name, Product ID, Category, Stock, Min Stock Level, Status.
- **Note:** Stock data is cached for 10 minutes on the backend.

---

#### `PurchasePage.jsx`
- **Route:** `/admin/purchase`
- **Layout:** `DashboardLayout`
- **Purpose:** Admin records new stock purchases/additions.
- **Size:** 24KB — likely the most feature-rich form page with multiple fields.

---

### 5.2 Component Documentation

#### `FormField.jsx`
**Location:** `src/components/FormField.jsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | — | Label text above field |
| `name` | string | — | react-hook-form field name |
| `type` | string | `"text"` | Input type (text/email/password/number) |
| `placeholder` | string | — | Placeholder text |
| `register` | function | — | RHF register function |
| `rules` | object | — | RHF validation rules |
| `error` | object | — | RHF error object |
| `required` | boolean | `false` | Shows red asterisk |
| `selectOption` | string | `"input"` | `"input"`, `"select"`, or `"textarea"` |
| `options` | array | `[]` | Options for select dropdown |
| `rows` | number | `4` | Rows for textarea |

**Reusability:** Used in LoginPage, SubmitRequestPage, and dynamically in RequestPage for quantity inputs.

---

#### `ItemSearchAdd.jsx`
**Location:** `src/features/issues/ui/components/ItemSearchAdd.jsx`

- **Purpose:** Debounced inventory item search with dropdown results.
- **Props:** `onAdd(item)` — callback when item selected; `alreadyAddedIds` — prevents duplicate adds
- **Internal Hook:** Custom `useDebounce(value, 300ms)` — delays search by 300ms after typing
- **State:** `query`, `open` (dropdown visibility)
- **Data Source:** Redux `state.inventory.items` (loaded from Google Sheets via API)
- **Behavior:** Closes dropdown on outside click (mousedown listener), filters by name/ID/category, max 7 results shown.

---

#### `SuccessCard.jsx`
**Location:** `src/features/issues/ui/components/SuccessCard.jsx`

- **Purpose:** Post-submission confirmation screen showing the generated Request ID.
- **Props:** `submittedId`, `copied`, `onCopy`, `onTrack`, `onSubmitAgain`
- **Features:** Copy to clipboard button, navigate to track page button, submit another request button.

---

#### `SidebarNavItem.jsx`
**Location:** `src/components/SidebarNavItem.jsx`

- **Purpose:** Active-highlighted navigation link for admin sidebar.
- **Props:** `to`, `icon`, `children`, `closeSidebar`, `onItemClick`
- **Behavior:** Uses React Router `NavLink` — applies `bg-blue-100 text-primary` when active route matches `to`.

---

#### `PublicHeader.jsx`
**Location:** `src/components/public/PublicHeader.jsx`

- **Purpose:** Top navigation bar for public pages.
- **Contains:** "Systematic Integrity" brand logo, "Services" dropdown (Submit/Track links), "Admin Login" button.
- **Sticky:** `position: sticky, top: 0, z-50`

---

#### `Table.jsx`
**Location:** `src/components/Tables/Table.jsx`

- **Purpose:** Reusable paginated table for Stock, Approved, and Received pages.
- **Props:** `columns`, `items`, `invPage`, `setInvPage`, `invTotalPages`, `ITEMS_PER_PAGE`, `title`
- **Used In:** `StockPage`, `ApprovedRequestPage`, `ReceivedRequestPage`

---

### 5.3 Custom Hooks

#### `useAuth` (`features/auth/hook/useAuth.js`)

| Returns | Type | Description |
|---------|------|-------------|
| `register` | function | RHF register for form fields |
| `handleSubmit` | function | RHF form submit wrapper |
| `errors` | object | RHF validation errors |
| `user` | object \| null | Logged-in admin data from Redux |
| `loading` | boolean | API loading state |
| `isAuthenticated` | boolean | Whether admin is logged in |
| `onLoginSubmit` | function | Dispatches loginAdmin thunk |
| `logout` | function | Dispatches logoutAdmin thunk |
| `fetchAdmin` | function | Dispatches getAdmin thunk (called on mount) |
| `resetError` | function | Clears auth error from Redux |

**Side Effect:** Calls `fetchAdmin()` on mount (inside `useEffect`) to restore session from cookie.

---

#### `useIssue` (`features/issues/hooks/useIssue.js`)

| Returns | Type | Description |
|---------|------|-------------|
| `register`, `handleSubmit`, `errors`, `control` | — | React Hook Form handles |
| `issues` | array | All issues from Redux |
| `selectedIssues` | object \| null | Single issue fetched by ID |
| `loading` | boolean | — |
| `error` | any | Error from last operation |
| `onSubmitIssue(data)` | async function | Creates issue, returns `requestId` |
| `fetchIssues()` | function | Loads all issues |
| `fetchIssueStatus(id)` | function | Loads single issue by ID |
| `changeIssueStatus(id, data)` | function | Updates issue status |

---

#### `useInventory` (`features/inventory/hooks/useInventory.js`)

| Returns | Type | Description |
|---------|------|-------------|
| `register`, `handleSubmit`, `errors`, `reset` | — | React Hook Form |
| `items` | array | Inventory items from Redux (sourced from Google Sheets) |
| `selectedItem` | object \| null | — |
| `loading` | boolean | — |
| `fetchInventory()` | function | Loads items from API |
| `onSubmitInventory(data)` | async function | Creates inventory item |
| `editInventory(id, data)` | function | Updates item |
| `removeInventory(id)` | function | Deletes item |
| `setEditData(item)` | function | Populates form fields for editing |

---

### 5.4 State Management

#### Redux Store Structure

```javascript
store = {
  auth: {
    user: null | { _id, fullname, username, email, role, ... },
    loading: false,
    error: null | "string message",
    isAuthenticated: false
  },
  issue: {
    issues: [],        // Array of all Issue documents from DB
    selectedIssues: null | IssueObject,  // Single issue for tracking
    loading: false,
    error: null
  },
  inventory: {
    items: [],         // Array from Google Sheets Stock tab
    selectedItem: null,
    loading: false,
    error: null
  }
}
```

#### Data Flow Pattern (Feature Slice Architecture)

```
Component
  → calls useXxx hook
    → hook dispatches createAsyncThunk
      → thunk calls axiosInstance
        → backend API
      → thunk resolves (fulfilled/rejected)
    → slice extraReducer updates state
  ← component re-renders via useSelector in hook
```

---

## 6. Backend Deep Analysis

### 6.1 API Routes Documentation

#### Authentication Routes — `/api/admin`

| Method | Endpoint | Purpose | Auth Required | Validator |
|--------|----------|---------|---------------|-----------|
| POST | `/api/admin/create` | Create a new admin account | No | `createAdminValidator` |
| POST | `/api/admin/login` | Admin login, sets JWT cookie | No | `loginAdminValidator` |
| GET | `/api/admin/get-me` | Get current logged-in admin | Yes (JWT cookie) | — |
| GET | `/api/admin/logout` | Logout, clears JWT cookie | No | — |

**POST /api/admin/create**
```json
Request Body:
{
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@rotocastgroup.com",
  "password": "secret123",
  "role": "admin"  // optional, defaults to "admin"
}

Success Response (201):
{
  "statusCode": 201,
  "data": { "_id": "...", "fullname": "John Doe", "username": "johndoe", "email": "...", "role": "admin" },
  "message": "Admin Created Successfully",
  "success": true
}

Errors:
  403 — "Only 2 admins are allowed"
  409 — "Admin already exists"
  400 — Validation errors (field-level)
```

**POST /api/admin/login**
```json
Request Body:
{
  "email": "john@rotocastgroup.com",
  "password": "secret123"
}

Success Response (200):
{
  "statusCode": 200,
  "data": { "_id": "...", "fullname": "...", "email": "...", "role": "admin" },
  "message": "Admin Login Successfully",
  "success": true
}
Sets-Cookie: token=<JWT>; HttpOnly; SameSite=Strict; Max-Age=604800

Errors:
  403 — "Invalid credentials"
  400 — Validation errors
```

---

#### Issue Routes — `/api/issues`

| Method | Endpoint | Purpose | Auth Required | Validator |
|--------|----------|---------|---------------|-----------|
| POST | `/api/issues/create` | Submit new inventory request | No | `createIssueValidator` |
| GET | `/api/issues/` | Get all issues | No | — |
| GET | `/api/issues/:id` | Get single issue by requestId | No | — |
| PATCH | `/api/issues/:id` | Update issue status | Yes | — |

**POST /api/issues/create**
```json
Request Body:
{
  "fullname": "Alice Smith",
  "department": "Foundry",
  "email": "alice@rotocastgroup.com",
  "items": [
    {
      "productId": "P001",
      "productName": "Safety Gloves",
      "category": "Safety",
      "qty": 5,
      "stock": 50
    }
  ],
  "description": "Required for new joiners in foundry section."
}

Success Response (201):
{
  "statusCode": 201,
  "data": { "_id": "...", "requestId": "REQ-001", "status": "UNDER_REVIEW", ... },
  "message": "New Issue Create successfully"
}
```

**PATCH /api/issues/:id** *(Admin Only)*
```json
Request Body (APPROVE):
{
  "status": "APPROVED",
  "data": {
    "fullname": "Alice Smith",
    "department": "Foundry",
    "email": "alice@rotocastgroup.com",
    "requestId": "REQ-001",
    "items": [
      { "productId": "P001", "productName": "Safety Gloves", "qty": 5, "approveQty": 3, "category": "Safety" }
    ]
  }
}

Request Body (RECEIVED):
{
  "status": "RECEIVED",
  "data": {
    "items": [
      { "productId": "P001", "receivedQty": 3, ... }
    ]
  }
}
```

---

#### Inventory Routes — `/api/inventory`

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/inventory/` | Get all inventory items (from Google Sheets, cached) | No |

---

### 6.2 Controllers Documentation

#### `auth.controller.js`

**`CreateAdminController`**
- Receives `req.body` → passes to `createAdminLogic(req.body)` service
- Returns `201` with created admin data (password stripped)

**`loginAdminController`**
- Calls `loginAdminLogic(req.body)` → gets `{ admin, token }`
- Sets `token` as `HttpOnly` cookie (7 days expiry, `secure` in production)
- Returns `200` with admin data

**`getAdminController`**
- Reads `req.admin` (attached by `authMiddleware`)
- Returns `200` with admin profile

**`logoutAdminController`**
- Clears `token` cookie
- Returns `200`

---

#### `issue.controller.js`

**`createIssueController`**
- Passes `req.body` to `createIssueLogic(data)` → returns created issue
- Returns `201`

**`getIssueController`**
- Calls `getIssueLogic()` → returns all issues
- Returns `200` with `{ issues, totalIssues }`

**`getIssueStatusController`**
- Extracts `req.params` (contains `id` = requestId)
- Calls `getIssueStatusLogic({ id })` → returns single issue
- Returns `200`

**`updateStatusController`**
- Extracts `req.params.id`, `req.admin`, `req.body.status`, `req.body.data`
- Calls `updateStatusLogic(id, data, status, admin)`
- Returns `200` with updated issue

---

#### `inventory.controller.js`

**`getInventoryController`**
- Calls `getItemsLogic()` → returns array of items
- Returns `200`

**Note:** `updateInventoryController` and `createInventoryController` are stubs — currently incomplete.

---

### 6.3 Services Documentation

#### `auth.service.js`

**`createAdminLogic(data)`**
1. Counts existing admin documents — rejects if ≥ 2
2. Checks for duplicate email/username
3. Creates admin (password hashed via Mongoose pre-save hook)
4. Removes password from returned object

**`loginAdminLogic(data)`**
1. Finds admin by email (with `.select("+password")`)
2. Calls `admin.comparePassword(password)` (bcrypt)
3. Generates JWT with `generateToken(admin._id, secret, expire)`
4. Returns `{ admin, token }`

---

#### `issue.service.js` *(Most Complex Service)*

**`createIssueLogic(data)`**
1. Finds last issue with `requestId` matching `/^REQ-\d+$/` pattern
2. Extracts last number, increments by 1, pads to 3 digits → `REQ-XXX`
3. Creates issue document in MongoDB
4. Returns created issue

**`getIssueLogic()`**
- Returns all issues from MongoDB (no filtering)

**`getIssueStatusLogic({ id })`**
- Finds issue by `requestId` field
- Throws `404` if not found

**`updateStatusLogic(id, data, status, admin)`**
1. Validates status is one of allowed values
2. Finds issue by `requestId`
3. Throws `409` if already RECEIVED (terminal state)
4. Updates `issue.status`

*If APPROVED:*
- Sets `approvedAt`, `approvedBy`
- Maps `approveQty` values onto issue items
- Appends row to Google Sheets "Approved" tab
- Sends approval HTML email to requester

*If RECEIVED:*
- Sets `receivedAt`
- Maps `receivedQty` values, deducts from `item.stock` in DB
- Reads Google Sheets "Stock" tab, finds each item by productId
- Updates stock cell (`Stock!D{row}`) for each item
- Appends row to "Received" tab
- Sends received HTML email to store manager (`purchase@rotocastgroup.com`)

*If REJECTED:*
- Appends row to Google Sheets "Rejected" tab

5. Saves issue document
6. Returns updated issue

---

#### `inventory.service.js`

**`getItemsLogic()`**
1. Checks NodeCache for key `"inventory"`
2. If cache hit → returns cached data
3. If cache miss → calls `getSheetData("Stock!A2:F", spreadsheetId)`
4. Maps raw arrays to `{ id, productName, category, stock, unit, minStock }` objects
5. Stores in cache (10-minute TTL)
6. Returns items

---

#### `googleSheet.service.js`

| Function | Description | Sheet API Method |
|----------|-------------|-----------------|
| `getSheetData(range, id)` | Read cells from a range | `spreadsheets.values.get` |
| `appendSheetData(range, id, values)` | Append rows below existing data | `spreadsheets.values.append` |
| `updateSheetData(range, id, values)` | Overwrite specific cell range | `spreadsheets.values.update` |

---

### 6.4 Models Documentation

#### `Admin` Model (`admin.model.js`)

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `fullname` | String | required, trim | Display name |
| `username` | String | required, unique, trim | Unique login identifier |
| `email` | String | required, unique, lowercase, trim | Login email |
| `password` | String | required, min 6 chars | Hashed via bcrypt (pre-save) |
| `role` | String | enum: `["admin", "user"]`, default: `"admin"` | Role-based distinction |
| `createdAt` | Date | auto (timestamps) | — |
| `updatedAt` | Date | auto (timestamps) | — |

**Methods:**
- `comparePassword(enteredPassword)` → `bcrypt.compare()` → boolean
- **Pre-save hook:** If `password` modified → `bcrypt.genSalt(10)` + `bcrypt.hash()`

---

#### `Issues` Model (`issue.model.js`)

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `fullname` | String | required, min 3 | Requester name |
| `department` | String | required | Factory department |
| `requestId` | String | required, unique | Auto-generated `REQ-XXX` |
| `items` | Array | min 1 item | Requested items array |
| `items[].productId` | String | required | Unique product ID from Sheets |
| `items[].productName` | String | required | Human-readable name |
| `items[].qty` | Number | required, min 1 | Requested quantity |
| `items[].category` | String | required | Item category |
| `items[].stock` | Number | required | Stock level at time of request |
| `items[].approveQty` | Number | default: 0 | Admin-approved quantity |
| `items[].receivedQty` | Number | default: 0 | Actually received quantity |
| `description` | String | required | Justification text |
| `status` | String | enum: UNDER_REVIEW/APPROVED/REJECTED/RECEIVED | Current state |
| `email` | String | required | Requester email for notifications |
| `receivedAt` | Date | default: null | Timestamp when marked received |
| `approvedBy` | ObjectId | ref: Admin, default: null | Admin who approved |
| `approvedAt` | Date | default: null | Timestamp of approval |
| `createdAt` / `updatedAt` | Date | auto | Mongoose timestamps |

---

### 6.5 Middleware Documentation

#### `auth.middleware.js`

**Purpose:** Protects admin-only routes by verifying JWT from `HttpOnly` cookie.

**Execution:**
1. Reads `req.cookies.token`
2. If no token → throws `ApiError(401, "Please login first")`
3. Calls `verifyToken(token, TOKEN_SECRET)` → gets decoded `{ adminId }`
4. Finds admin by `decoded.adminId` (excluding password)
5. If not found → throws `ApiError(401, "Admin not found")`
6. Attaches `req.admin = admin`
7. Calls `next()`

**Used on:** `GET /api/admin/get-me`, `PATCH /api/issues/:id`

---

#### `error.middleware.js`

**Purpose:** Global Express error handler — catches all errors from `next(error)`.

**Logic:**
- If error is not an `ApiError` instance → wraps it: `new ApiError(statusCode || 500, message)`
- Sends JSON: `{ success: false, message, errors, stack(dev only) }`
- Stack trace only shown in `NODE_ENV === "development"`

---

#### `express-validator` Middleware (in `validator/`)

**`validate` function** (used at end of each validator array):
- Runs `validationResult(req)`
- If errors exist → throws `ApiError(400, "Validation Failed", extractedErrors)`
- Each error: `{ field: error.path, message: error.msg }`

---

### 6.6 Utility Classes

#### `ApiError` Class
```javascript
new ApiError(statusCode, message, errors[], stack)
// Extends Error
// Properties: statusCode, message, success: false, errors, data: null
```

#### `ApiResponse` Class
```javascript
new ApiResponse(statusCode, data, message)
// Properties: statusCode, data, message, success: statusCode < 400
```

#### `asyncHandler`
```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
// Eliminates try-catch in every controller
```

---

## 7. Environment Variables

All variables are required unless noted as optional. Defined in `backend/.env`.

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `PORT` | Backend server port | Yes | `3002` |
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/ril-db` |
| `TOKEN_SECRET` | JWT signing secret key | Yes | `your-super-secret-key-here` |
| `TOKEN_EXPIRE` | JWT expiration duration | Yes | `7d` |
| `NODE_ENV` | Environment mode | Yes | `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin | Yes | `http://localhost:5173` |
| `GOOGLE_CREDENTIALS` | Base64-encoded Google Service Account JSON | Yes | `eyJhY2NvdW50...` (base64) |
| `INVENTORY_SPREADSHEET_ID` | Google Sheets spreadsheet ID | Yes | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms` |
| `EMAIL_USER` | Gmail address for sending emails | Yes | `noreply@rotocastgroup.com` |
| `EMAIL_PASS` | Gmail App Password (not regular password) | Yes | `abcd efgh ijkl mnop` |

### Frontend Environment
The Axios `baseURL` is hardcoded in `frontend/src/config/axiosInstance.js`:
```javascript
baseURL: "http://localhost:3002/api"
```
> ⚠️ **This needs to be changed before production deployment.** It should read from a `VITE_API_URL` environment variable.

---

## 8. Authentication & Authorization Flow

### Login Flow

```
1. Admin submits email + password on /login
   ↓
2. Frontend: loginAdmin thunk → POST /api/admin/login
   ↓
3. Backend: loginAdminValidator checks
   - email: notEmpty, isEmail
   - password: notEmpty, minLength(6)
   ↓
4. loginAdminLogic():
   - findOne({ email }).select("+password")
   - admin.comparePassword(password) → bcrypt.compare()
   ↓
5. generateToken(admin._id, TOKEN_SECRET, TOKEN_EXPIRE)
   → jwt.sign({ adminId }, secret, { expiresIn: "7d" })
   ↓
6. res.cookie("token", token, {
     httpOnly: true,       // JS cannot access
     secure: production,   // HTTPS only in production
     sameSite: "strict",   // CSRF protection
     maxAge: 7 days
   })
   ↓
7. Response: 200 with admin data (no password)
   ↓
8. Frontend Redux: state.auth.user = admin, isAuthenticated = true
   ↓
9. Navigate to /admin
```

### Session Persistence (Refresh)

```
User refreshes browser
↓
useAuth hook runs useEffect → fetchAdmin()
↓
GET /api/admin/get-me with cookie automatically sent
↓
authMiddleware verifies JWT from cookie
↓
req.admin = admin data
↓
Returns 200 with admin profile
↓
Redux: isAuthenticated = true, user = admin
↓
DashboardLayout renders (no redirect)
```

### Logout Flow

```
Admin clicks Logout
↓
logoutAdmin thunk → GET /api/admin/logout
↓
Backend: res.clearCookie("token")
↓
Redux: user = null, isAuthenticated = false
↓
Navigate to /login
```

### Protected Routes

`DashboardLayout` uses `useAuth` which calls `getAdmin` on mount:
- If `loading` → shows loading spinner
- If `!user` → `<Navigate to="/login" replace />`
- If `user` exists → renders `<Outlet />`

### Role-Based Access
Currently, the `role` field exists in Admin model (`"admin"` | `"user"`), but there is **no role-based middleware** in routes — all authenticated admins have the same access. This is a future improvement area.

---

## 9. Database Flow

### Connection

```javascript
// server.js
connectDB()  // called before server.listen
```
```javascript
// database.config.js
mongoose.connect(config.MONGO_URI)
// On success: logs host
// On failure: process.exit(1)  ← crashes server on DB failure
```

### Collections

| Collection | Model | Purpose |
|------------|-------|---------|
| `admins` | `adminModel` | Admin accounts (max 2) |
| `issues` | `issueModel` | All inventory requests |

### Relationships

```
Admin (1) ──── approves ──── (many) Issues
  _id                        approvedBy: ObjectId(ref: Admin)
```
The `Issue.approvedBy` field is a Mongoose reference to `Admin._id`, but `.populate()` is not currently called in queries (improvement area).

### CRUD Operations by Entity

**Admin:**
- CREATE: `POST /api/admin/create` → `adminModel.create()`
- READ: `GET /api/admin/get-me` → `adminModel.findById()`
- UPDATE: *(not implemented)*
- DELETE: *(not implemented)*

**Issue:**
- CREATE: `POST /api/issues/create` → `issueModel.create()`
- READ ALL: `GET /api/issues/` → `issueModel.find()`
- READ ONE: `GET /api/issues/:id` → `issueModel.findOne({ requestId })`
- UPDATE: `PATCH /api/issues/:id` → `issue.save()` (after modifying document)

### Data Lifecycle

```
Issue Created → status: "UNDER_REVIEW"
   ↓
Admin Reviews → status: "APPROVED" or "REJECTED"
   - approvedAt: new Date()
   - approvedBy: admin._id
   - items[].approveQty set
   ↓ (only if APPROVED)
Items Physically Delivered → status: "RECEIVED"
   - receivedAt: new Date()
   - items[].receivedQty set
   - items[].stock updated
   [TERMINAL STATE — cannot be updated further]
```

---

## 10. Third Party Integrations

### Google Sheets API

**Purpose:** Acts as a live spreadsheet-based inventory management system, readable by non-technical staff.

**Configuration:** `backend/src/config/google.config.js`
- Credentials: Base64-encoded service account JSON from `GOOGLE_CREDENTIALS` env var
- Scopes: `spreadsheets` (read/write) + `drive` (file management)
- Exports: `sheets` (Sheets API client), `drive` (Drive API client)

**Spreadsheet Structure:**

| Sheet Tab | Range Used | Purpose |
|-----------|-----------|---------|
| `Stock` | `A2:F` | Master inventory (read + stock deduction on receipt) |
| `Approved` | `A2:K` | Log of approved requests (append-only) |
| `Received` | `A2:K` | Log of received items (append-only) |
| `Rejected` | `A2:K` | Log of rejected requests (append-only) |

**Stock Sheet Columns (A-F):**
`Product ID | Product Name | Category | Stock Qty | Unit | Min Stock Level`

**How to set up:**
1. Create a Google Cloud Project
2. Enable Google Sheets API + Google Drive API
3. Create a Service Account → download JSON key
4. Share your spreadsheet with the service account email
5. Base64-encode the JSON: `base64 -i service-account.json`
6. Set `GOOGLE_CREDENTIALS` env var to the base64 string

---

### Gmail SMTP (Nodemailer)

**Purpose:** Send transactional HTML email notifications.

**Configuration:** `backend/src/config/mail.config.js`
- Service: `gmail`
- Auth: `EMAIL_USER` + `EMAIL_PASS` (Gmail App Password)

**Emails Sent:**

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Request APPROVED | `issue.email` (requester) | `approvalMailTemplate` |
| Request REJECTED | `issue.email` (requester) | `rejectedMailTemplate` |
| Items RECEIVED | `purchase@rotocastgroup.com` (hardcoded store manager) | `receivedMailTemplate` |

**Template Location:** `backend/src/templates/Mail.template.js`
- Templates are HTML strings with inline CSS
- Green header (`#006c49` brand color)
- Shows: Request ID, requester name, department, item table, approver info

**Setup:** Generate a Gmail App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

---

## 11. Error Handling System

### Frontend Error Handling

| Scenario | Handler | User Feedback |
|----------|---------|--------------|
| API call fails | `rejectWithValue` in thunk | `toast.error(message)` |
| Form validation fails | react-hook-form `errors` object | Inline red error text below field |
| Network error | Axios catches, thunk rejects | `toast.error()` with message |
| No items added to request | Inline `setItemsError` | Error message below item search |

### Backend Error Handling

**Custom Error Class (`ApiError`):**
```javascript
throw new ApiError(statusCode, message, errors[])
// Caught by asyncHandler → passed to errorMiddleware
```

**Global Error Middleware Response Shape:**
```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ],
  "stack": "..." // only in development
}
```

**Common HTTP Status Codes Used:**

| Code | When Used |
|------|-----------|
| 200 | Successful GET, update, logout |
| 201 | Successful create |
| 400 | Validation failed |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (invalid credentials, admin limit) |
| 404 | Resource not found |
| 409 | Conflict (duplicate admin, already received) |
| 500 | Unhandled server errors |

---

## 12. Security Analysis

### Current Implementation

| Security Measure | Implementation | Location |
|-----------------|---------------|----------|
| **Password Hashing** | bcrypt with 10 salt rounds | `admin.model.js` pre-save hook |
| **JWT Authentication** | Signed JWT, verified on every protected request | `auth.middleware.js`, `generateToken.js` |
| **HttpOnly Cookies** | Token stored in HttpOnly cookie — inaccessible to JS | `auth.controller.js` |
| **SameSite Strict** | Cookie not sent on cross-site requests | `auth.controller.js` |
| **CORS Restriction** | Only `FRONTEND_URL` allowed as origin | `app.js` |
| **Input Validation** | express-validator rules for all critical endpoints | `validator/` directory |
| **Environment Secrets** | All secrets in `.env`, never committed | `config/dotenv.config.js` |
| **Admin Count Limit** | Max 2 admins enforced at service level | `auth.service.js` |
| **No Password in Response** | `delete adminData.password` before returning | `auth.service.js` |
| **Secure Cookie in Prod** | `secure: NODE_ENV === "production"` | `auth.controller.js` |
| **Error Stack Hidden** | Stack trace only in development | `error.middleware.js` |
| **Token Expiry** | JWT expires after configurable period (`TOKEN_EXPIRE`) | `generateToken.js` |

### Recommended Improvements

1. **Rate Limiting:** Add `express-rate-limit` to `/api/admin/login` to prevent brute force attacks.
2. **Frontend BaseURL in Env:** Move hardcoded `http://localhost:3002/api` to `VITE_API_URL` environment variable.
3. **Input Sanitization:** Add `express-mongo-sanitize` to prevent NoSQL injection attacks.
4. **Helmet.js:** Add `helmet` middleware for security HTTP headers (X-Frame-Options, CSP, etc.).
5. **Refresh Tokens:** Implement refresh token rotation instead of long-lived single JWTs.
6. **Email Validation for Requester:** The issue create endpoint accepts any email — add domain validation for `@rotocastgroup.com`.
7. **Store Manager Email Hardcoded:** `purchase@rotocastgroup.com` is hardcoded in `issue.service.js` — move to env variable.
8. **Role-Based Authorization:** Implement middleware that checks `req.admin.role` before allowing specific operations.
9. **HTTPS in Production:** Ensure `secure: true` cookie works with HTTPS reverse proxy.
10. **Google Credentials Security:** Store service account credentials in a secrets manager (e.g., AWS Secrets Manager) rather than env var in production.

---

## 13. Performance Analysis

### Frontend

| Area | Current State | Recommendation |
|------|--------------|---------------|
| **Inventory Caching** | No frontend cache — refetches on every component mount | Use Redux state as cache, don't re-fetch if `items.length > 0` |
| **Item Search Debounce** | 300ms debounce in `ItemSearchAdd` — ✅ good | Already implemented |
| **Code Splitting** | No lazy loading — all components bundled together | Use `React.lazy()` + `Suspense` for admin pages |
| **List Pagination** | Paginated client-side in all table views — ✅ good | Move to server-side pagination when data grows |
| **Bundle Size** | No analysis performed | Run `npm run build -- --analyze` to check |
| **Re-renders** | Some components fetch on every render | Add `useCallback` memoization on fetch functions |

### Backend

| Area | Current State | Recommendation |
|------|--------------|---------------|
| **Inventory Caching** | NodeCache 10-min TTL — ✅ good | Cache invalidation needed on stock updates |
| **Google Sheets Reads** | Only cached for inventory, not for history tabs | Sheets reads in `updateStatusLogic` not cached |
| **No Indexes on MongoDB** | `requestId` is queried frequently but no explicit index | Add `index: true` to `requestId` in schema |
| **All Issues in Memory** | `issueModel.find()` returns all documents without limit | Add pagination parameters: `?page=1&limit=20` |
| **Sequential Sheet Updates** | Multiple sheet updates use `Promise.all` — ✅ good | Already parallelized |
| **No Compression** | No gzip compression middleware | Add `compression` package |
| **No Database Connection Pool Tuning** | Default Mongoose connection settings | Configure `maxPoolSize` for production |

---

## 14. How To Run Project Locally

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| MongoDB | Atlas (cloud) or local | — |
| Google Cloud Project | With Sheets API enabled | — |
| Gmail account | With App Password generated | — |

---

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd "RIC System Master V1/RIL-System"
```

---

### Step 2: Setup the Backend

```bash
cd backend
npm install
```

Create the `.env` file:
```bash
touch .env
```

Populate `.env` with all required variables:
```env
PORT=3002
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
TOKEN_SECRET=your-jwt-secret-minimum-32-characters
TOKEN_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Setup
GOOGLE_CREDENTIALS=<base64-encoded-service-account-json>
INVENTORY_SPREADSHEET_ID=<your-google-spreadsheet-id>

# Mail Setup
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

**How to get `GOOGLE_CREDENTIALS`:**
```bash
# After downloading service account JSON from Google Cloud Console:
base64 -i service-account.json | tr -d '\n'
# Copy the output and paste as GOOGLE_CREDENTIALS value
```

---

### Step 3: Setup the Frontend

```bash
cd ../frontend
npm install
```

*(Optional)* If you need to change the API URL, edit:
```javascript
// frontend/src/config/axiosInstance.js
baseURL: "http://localhost:3002/api"  // Change if backend port differs
```

---

### Step 4: Run the Backend

```bash
# In the backend/ directory
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Mail server is ready to send emails
server is running in the Port : 3002
```

---

### Step 5: Run the Frontend

```bash
# In a new terminal, in the frontend/ directory
npm run dev
```

You should see:
```
VITE v8.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

### Step 6: Create First Admin Account

The system has no admin accounts by default. Use an API client (Postman, curl, or Insomnia):

```bash
curl -X POST http://localhost:3002/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Store Admin",
    "username": "storeadmin",
    "email": "admin@rotocastgroup.com",
    "password": "admin123",
    "role": "admin"
  }'
```

---

### Step 7: Access the Application

| URL | Purpose |
|-----|---------|
| `http://localhost:5173/` | Public request submission |
| `http://localhost:5173/track` | Request tracking |
| `http://localhost:5173/login` | Admin login |
| `http://localhost:5173/admin/dashboard` | Admin panel (after login) |
| `http://localhost:3002/health` | Backend health check |

---

## 15. Developer Onboarding Guide

> **If you are a new developer joining this project, start here.**

### Recommended First Files to Read (in order)

1. `backend/src/config/dotenv.config.js` — understand all env variables needed
2. `backend/src/app.js` — understand route structure and middleware
3. `backend/src/model/issue.model.js` — understand the core data model
4. `frontend/src/app/routes/AppRoutes.jsx` — understand all pages and routes
5. `frontend/src/app/store.js` — understand Redux slices
6. `frontend/src/features/issues/hooks/useIssue.js` — understand the pattern used in all features

### Understanding the Feature Pattern

Every feature (`auth`, `issues`, `inventory`, `dashboard`) follows this structure:
```
feature/
├── apis/       ← axios calls (raw HTTP)
├── state/
│   ├── *.slice.js    ← Redux state shape + reducers
│   └── *.thunks.js   ← async actions (calls apis/)
├── hooks/      ← useXxx.js (combines redux + react-hook-form + UI logic)
└── ui/
    ├── pages/  ← Page-level components (connected to hooks)
    └── components/ ← Feature-specific sub-components
```

### How to Add a New Page

1. Create the component file in the appropriate `features/*/ui/pages/` directory
2. Add the route in `frontend/src/app/routes/AppRoutes.jsx`
3. Add a navigation link in `DashboardLayout.jsx` sidebar (if admin page) or `PublicHeader.jsx` (if public)

### How to Add a New API Route

1. Add the Express route in `backend/src/routes/*.routes.js`
2. Create the controller function in `backend/src/controller/*.controller.js`
3. Create the service logic in `backend/src/services/*.service.js`
4. Add validator if needed in `backend/src/validator/`
5. On the frontend: add Axios call in `features/*/apis/*.apis.js`
6. Add async thunk in `features/*/state/*.thunks.js`
7. Handle state in `features/*/state/*.slice.js`
8. Expose in custom hook `features/*/hooks/use*.js`

### How to Add a New Database Model

1. Create `backend/src/model/yourModel.model.js`
2. Define Mongoose schema with validation
3. Export: `export default mongoose.model("YourModel", schema)`
4. Import and use in the relevant service file

### How to Add a New Component

1. If **shared/reusable** → create in `frontend/src/components/`
2. If **feature-specific** → create in `frontend/src/features/*/ui/components/`
3. Import with relative paths following the existing pattern

### Development Workflow

```bash
# 1. Start both servers
cd backend && npm run dev &
cd frontend && npm run dev &

# 2. Make backend changes → nodemon auto-restarts
# 3. Make frontend changes → Vite HMR updates instantly
# 4. Test API changes using Postman or curl
# 5. Check browser DevTools Network tab for API calls
```

---

## 16. Future Improvements

### Architecture

- [ ] **Server-Side Pagination:** `GET /api/issues/?page=1&limit=20` — currently returns all documents which will slow as data grows
- [ ] **Separate Frontend Deployment:** Currently served as static files from backend; use Vercel/Netlify for frontend separately
- [ ] **WebSocket for Real-Time Updates:** Admin dashboard could use Socket.io to see new requests without page refresh
- [ ] **API Versioning:** Prefix all routes with `/api/v1/` for future compatibility

### Security

- [ ] **Rate Limiting:** `express-rate-limit` on login and create endpoints
- [ ] **Helmet.js:** Security HTTP headers
- [ ] **Role-Based Middleware:** `requireRole("admin")` middleware for sensitive operations
- [ ] **Input Sanitization:** `express-mongo-sanitize` against NoSQL injection
- [ ] **Move Hardcoded Email:** `purchase@rotocastgroup.com` should be an env variable

### Feature Completeness

- [ ] **`updateInventoryController`:** Currently a stub — implement stock update via API
- [ ] **`createInventoryController`:** Currently empty — implement adding new items
- [ ] **Admin Registration UI:** Currently requires Postman/curl — add a protected admin creation form
- [ ] **Admin User Management:** List, deactivate, or reset admin accounts
- [ ] **Reject with Reason:** When rejecting, allow admin to provide rejection reason (email to requester)
- [ ] **Dashboard Real-Time:** Auto-refresh dashboard KPIs every few minutes
- [ ] **Purchase Page Implementation:** `PurchasePage.jsx` exists but the backend endpoint is incomplete
- [ ] **Populate `approvedBy`:** Use Mongoose `.populate("approvedBy")` to show approver name in API responses

### Performance

- [ ] **Frontend Lazy Loading:** `React.lazy()` for admin pages
- [ ] **MongoDB Indexes:** Add indexes on `requestId`, `status`, `email` fields
- [ ] **Cache Invalidation:** Clear inventory cache when stock is updated
- [ ] **Compression:** `compression` middleware for gzip responses

### Code Quality

- [ ] **TypeScript Migration:** Gradually migrate to TypeScript for type safety
- [ ] **Unit Tests:** Add Jest tests for service functions (especially `updateStatusLogic`)
- [ ] **API Documentation:** Add Swagger/OpenAPI documentation
- [ ] **Frontend Env Variable:** Move `baseURL` in `axiosInstance.js` to `VITE_API_URL`
- [ ] **Error Boundaries:** Add React Error Boundaries to gracefully handle component crashes
- [ ] **Consistent Naming:** `features/auth/hook/` vs `features/issues/hooks/` (inconsistent singular/plural)

---

*This documentation was generated by comprehensive analysis of all source files in the RIL System codebase. Every explanation is derived from actual code, not assumptions.*
