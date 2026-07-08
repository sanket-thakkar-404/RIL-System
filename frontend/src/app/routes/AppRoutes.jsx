import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import PublicLayout from "../layout/PublicLayout";
import LoginPage from "../../features/auth/ui/pages/LoginPage";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../../features/dashboard/ui/pages/Dashboard";
import SubmitRequestPage from "../../features/issues/ui/pages/SubmitRequestPage";
import TrackRequestPage from "../../features/issues/ui/pages/TrackRequestPage";
import RequestPage from "../../features/issues/ui/pages/RequestPage";
import StockPage from "../../features/inventory/ui/pages/StockPage";
import ApprovedRequestPage from "../../features/issues/ui/pages/ApprovedRequestPage";
import PurchasePage from "../../features/inventory/ui/pages/PurchasePage";
import ReceivedRequestPage from "../../features/issues/ui/pages/ReceivedRequestPage";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        {
          path: "",
          element: <SubmitRequestPage />,
        },
        {
          path: "track",
          element: <TrackRequestPage />,
        },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "request",
          element: <RequestPage />,
        },
        {
          path: "stock",
          element: <StockPage />,
        },
        {
          path: "approve",
          element: <ApprovedRequestPage />,
        },
        {
          path: "purchase",
          element: <PurchasePage />,
        },
        {
          path: "received",
          element: <ReceivedRequestPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
