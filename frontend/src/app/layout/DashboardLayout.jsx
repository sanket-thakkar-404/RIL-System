import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import {
  ClipboardList,
  Box,
  LogOut,
  Bell,
  LayoutDashboard,
  Menu,
  X,
  ClipboardCheck,
  ShoppingCart,
  Package,
} from "lucide-react";
import SidebarNavItem from "../../components/SidebarNavItem";
import { useAuth } from "../../features/auth/hook/useAuth";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <span className="skeleton skeleton-text">Dashboard loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="p-6 pb-8 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-primary tracking-tight">
                Admin Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Inventory Control
              </p>
            </div>
            <button
              className="lg:hidden text-slate-500 hover:bg-slate-200 p-1 rounded"
              onClick={closeSidebar}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1 px-4">
            <SidebarNavItem
              to="/admin/dashboard"
              children="Dashboard"
              closeSidebar={closeSidebar}
              icon={<LayoutDashboard size={18} />}
            />
            <SidebarNavItem
              to="/admin/request"
              children="Pending Requests"
              closeSidebar={closeSidebar}
              icon={<ClipboardList size={18} />}
            />
            <SidebarNavItem
              to="/admin/approve"
              children="Approve Request"
              closeSidebar={closeSidebar}
              icon={<ClipboardCheck size={18} />}
            />
            <SidebarNavItem
              to="/admin/received"
              children="Received Request"
              closeSidebar={closeSidebar}
              icon={<Package size={18} />}
            />
            <SidebarNavItem
              to="/admin/stock"
              children="Stock Levels"
              closeSidebar={closeSidebar}
              icon={<Box size={18} />}
            />

            <SidebarNavItem
              to="/admin/purchase"
              children="Purchase"
              closeSidebar={closeSidebar}
              icon={<ShoppingCart size={18} />}
            />
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-4 mb-4">
          <SidebarNavItem
            to="/login"
            children="Logout"
            closeSidebar={closeSidebar}
            onItemClick={logout}
            icon={<LogOut size={18} />}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white w-full">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between lg:justify-end px-4 lg:px-8 border-b border-slate-200 bg-white shrink-0">
          {/* Hamburger Menu for Mobile */}
          <button
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-slate-500 hover:text-slate-700 transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-10 w-20 rounded-full bg-slate-300 overflow-hidden border border-slate-200 shadow-sm items-center flex justify-center">
              {/* Placeholder Avatar */}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYtgZ8VfqkyfYGhpk4W7f_2LZr7aGeuO5MknRFa-mE9A&s=10"
                alt="Admin Avatar"
                className="h-7 object-cover items-center"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content Wrapper */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
