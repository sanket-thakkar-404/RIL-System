import {
  ClipboardList,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useIssue } from "../../../issues/hooks/useIssue";
import { useEffect } from "react";
import { useInventory } from "../../../inventory/hooks/useInventory";

const Dashboard = () => {
  const { fetchIssues, issues } = useIssue();
  const { fetchInventory, items } = useInventory();
  const navigate = useNavigate();
  useEffect(() => {
    fetchIssues();
    fetchInventory();
  }, []);

  const lowStockItems =
    items?.filter((item) => item.stock <= item.minStock).length || 0;
  const healthyItems =
    items?.filter((item) => item.stock > item.minStock).length || 0;

  const inventoryHealth =
    items?.length > 0 ? Math.round((healthyItems / items.length) * 100) : 0;
  const totalRequests = issues?.length || 0;
  const pendingRequests =
    issues?.filter((item) => item.status === "UNDER_REVIEW").length || 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full gap-8 pb-12">
      {/* Header Section */}
      <div>
        <h2 className="text-[28px] font-bold text-slate-900 tracking-tight mb-1">
          Dashboard Overview
        </h2>
        <p className="text-slate-600 font-medium">
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Requests Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-md bg-blue-100 text-blue-700">
              <ClipboardList size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Today
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {totalRequests}
          </h3>
          <p className="text-sm text-slate-500 font-medium">Total Requests</p>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-amber-400"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-md bg-amber-100 text-amber-700">
              <Clock size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Requires Action
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {pendingRequests}
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Pending Approvals
          </p>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-rose-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-md bg-rose-100 text-rose-700">
              <AlertCircle size={24} />
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              Critical
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {lowStockItems}
          </h3>
          <p className="text-sm text-slate-500 font-medium">Low Stock Items</p>
        </div>

        {/* Inventory Health Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-md bg-emerald-100 text-emerald-700">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {inventoryHealth}%
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Overall Stock Health
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions / Shortcuts */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Quick Actions
          </h3>

          <Link
            to="/admin/request"
            className="group bg-primary hover:bg-primary§§§§ transition-colors rounded-lg p-5 flex items-center justify-between shadow-md"
          >
            <div>
              <h4 className="text-white font-bold text-lg mb-1">
                Review Requests
              </h4>
              <p className="text-blue-200 text-sm">
                Approve or reject pending inventory requests.
              </p>
            </div>
            <div className="text-white transform group-hover:translate-x-1 transition-transform">
              <ArrowRight size={24} />
            </div>
          </Link>

          <Link
            to="/admin/stock"
            className="group bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-lg p-5 flex items-center justify-between shadow-sm"
          >
            <div>
              <h4 className="text-slate-800 font-bold text-lg mb-1">
                Manage Stock
              </h4>
              <p className="text-slate-500 text-sm">
                View current inventory levels and history.
              </p>
            </div>
            <div className="text-slate-400 transform group-hover:translate-x-1 transition-transform">
              <ArrowRight size={24} />
            </div>
          </Link>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 text-lg">
              Recent Activity
            </h3>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-6">
            {issues?.length > 0 ? (
              [...issues]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((item, index) => {
                  const initials = item.fullname
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div key={index} className="flex gap-4">
                      {/* Avatar */}
                      <div className="mt-1">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {initials}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">
                          <span className="font-semibold">{item.fullname}</span>

                          {item.status === "UNDER_REVIEW" && (
                            <> submitted new request for </>
                          )}

                          {item.status === "APPROVED" && (
                            <> approved request for </>
                          )}

                          {item.status === "REJECTED" && (
                            <> rejected request for </>
                          )}

                          <span className="font-semibold text-primary">
                            {item.items?.length > 0 ? "" :"items"} 
                          </span>
                        </p>

                        <p
                          className={`text-xs mt-1 font-semibold ${
                            item.status === "RECEIVED"
                              ? "text-emerald-600"
                              : item.status === "REJECTED"
                              ? "text-rose-600"
                              : item.status === "APPROVED"
                              ? "text-orange-300"
                              : "text-primary-fixed-dim"
                          }`}
                        >
                          {item.status}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-slate-500 font-medium">
                  No activity found
                </p>
              </div>
            )}

            <button
              onClick={() => {
                navigate("/admin/approve");
              }}
              className="mt-auto text-center text-sm font-semibold text-primary hover:underline py-2"
            >
              View Full Activity Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
