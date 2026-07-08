import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useIssue } from "../../hooks/useIssue";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// Real API-shaped mock data

const REQUESTS_PER_PAGE = 4;

// Derive initials from fullname
const getInitials = (fullname) =>
  fullname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// Assign a consistent avatar color based on name
const AVATAR_COLORS = [
  "bg-emerald-200 text-emerald-900",
  "bg-orange-200 text-orange-900",
  "bg-blue-200 text-blue-900",
  "bg-indigo-200 text-indigo-900",
  "bg-purple-200 text-purple-900",
  "bg-pink-200 text-pink-900",
  "bg-teal-200 text-teal-900",
  "bg-yellow-200 text-yellow-900",
];
const getAvatarColor = (name) => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// Derive stock status from stock and requested qty
const getStockStatus = (stock, qty) => {
  if (stock === 0) return "Out of Stock";
  if (stock < qty) return "Insufficient";
  return "Available";
};

const stockBadge = (status) => {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold";
  if (status === "Available") return `${base} bg-emerald-100 text-emerald-800`;
  if (status === "Insufficient") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-rose-100 text-rose-800`;
};

const dotColor = (status) => {
  if (status === "Available") return "bg-emerald-500";
  if (status === "Insufficient") return "bg-amber-500";
  return "bg-rose-500";
};

// Format ISO date to readable
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const RequestPage = () => {
  const issues = useSelector((state) => state.issue.issues);
  const { fetchIssues, changeIssueStatus, loading } = useIssue();
  const [approvedQty, setApprovedQty] = useState({});
  const requests = issues?.filter((req) => req.status === "UNDER_REVIEW") || [];
  const [page, setPage] = useState(1);
  const [approveLoadingId, setApproveLoadingId] = useState(null);
  const [rejectedLoadingId, setRejectedLoadingId] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const totalPages = Math.ceil(requests.length / REQUESTS_PER_PAGE) || 1;
  const pageStart = (page - 1) * REQUESTS_PER_PAGE;
  const pageItems = requests.slice(pageStart, pageStart + REQUESTS_PER_PAGE);

  const handleApproveQtyChange = (requestId, itemIndex, value) => {
    setApprovedQty((prev) => ({
      ...prev,

      [`${requestId}-${itemIndex}`]: Number(value),
    }));
  };

  const handleAction = async (requestId, action, req) => {
    const data = {
      status: action,
      data: req,
    };
    // yaha lagana tha

    if (data.status === "APPROVED") {
      setApproveLoadingId(requestId);
    } else {
      setRejectedLoadingId(requestId);
    }
    try {
      await changeIssueStatus(requestId, data);
      toast.success(
        `Request ${requestId} ${action.toLowerCase()}d successfully`,
      );
    } catch (err) {
      toast.error(err?.message || err || "Failed to update status");
    } finally {
      setApproveLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Pending Requests
          </h2>
          <p className="text-slate-600 font-medium text-sm">
            Manage and validate incoming inventory distribution requests.
          </p>
        </div>
        <div className="lg:w-fit md:w-fit  w-full border bg-white border-slate-200 rounded-md px-6 py-4 text-center shadow-sm shrink-0">
          <p className="text-[11px] font-bold  text-slate-500 tracking-wider mb-1">
            TOTAL PENDING
          </p>
          <p className="text-3xl font-bold text-primary">{requests.length}</p>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800 text-lg">
            Live Request Queue
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#e4efff] text-slate-600 text-[13px] text-center">
              <tr>
                <th className="px-6 py-3 font-semibold w-28">REQ ID</th>
                <th className="px-6 py-3 font-semibold w-44">USER</th>
                <th className="px-6 py-3 font-semibold">ITEM NAME</th>
                <th className="px-6 py-3 font-semibold w-16">QTY</th>
                <th className="px-6 py-3 font-semibold w-32">APPROVE QTY</th>
                <th className="px-6 py-3 font-semibold w-44">STOCK CHECK</th>
                <th className="px-6 py-3 font-semibold w-44">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pageItems.length > 0 ? (
                pageItems.map((req, rIndex) => {
                  const initials = getInitials(req.fullname);
                  const avatarColor = getAvatarColor(req.fullname);
                  return (
                    <tr key={rIndex} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 align-top">
                        <span className="font-bold text-primary">
                          #{req.requestId}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {fmtDate(req.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700 leading-tight">
                              {req.fullname}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {req.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Multi-item sub-columns */}
                      <td className="px-0 py-0 align-top" colSpan={4}>
                        <table className="w-full">
                          <tbody>
                            {req.items.map((item, iIndex) => {
                              const stockStatus = getStockStatus(
                                item.stock,
                                item.qty,
                              );
                              return (
                                <tr
                                  key={iIndex}
                                  className={
                                    iIndex > 0
                                      ? "border-t border-slate-100"
                                      : ""
                                  }
                                >
                                  <td className="px-6 py-3">
                                    <p className="font-medium text-slate-800">
                                      {item.productName}
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                      {item.category}
                                    </p>
                                  </td>
                                  <td className="px-6 py-3 text-center font-medium text-slate-700">
                                    {item.qty}
                                  </td>
                                  <td className="px-6 py-3 w-32">
                                    <input
                                      type="number"
                                      value={
                                        approvedQty[
                                          `${req.requestId}-${iIndex}`
                                        ] ??
                                        item.approveQty ??
                                        item.qty
                                      }
                                      onChange={(e) =>
                                        handleApproveQtyChange(
                                          req.requestId,
                                          iIndex,
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-blue-200 bg-blue-50/50 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-400"
                                    />
                                  </td>
                                  <td className="px-6 py-3 w-44">
                                    <span className={stockBadge(stockStatus)}>
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor(
                                          stockStatus,
                                        )}`}
                                      />
                                      {stockStatus} ({item.stock})
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </td>

                      <td className="px-6 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            disabled={approveLoadingId === req.requestId}
                            onClick={() => {
                              const updatedItems = req.items.map(
                                (item, index) => ({
                                  ...item,
                                  approveQty:
                                    approvedQty[`${req.requestId}-${index}`] ??
                                    item.approveQty ??
                                    item.qty,
                                }),
                              );

                              const hasInvalidQty = updatedItems.some(
                                (item) => Number(item.approveQty) <= 0,
                              );
                              const InvalidQty = updatedItems.some((item) => {
                                const approveQty = Number(item.approveQty);

                                const originalQty = Number(item.qty);

                                return approveQty > originalQty;
                              });

                              if (InvalidQty) {
                                toast.error(
                                  "Approve quantity must not be greater than Issue quantity",
                                );
                                return;
                              }
                              if (hasInvalidQty) {
                                toast.error(
                                  "Approve quantity must be greater than 0",
                                );
                                return;
                              }

                              const updatedReq = {
                                ...req,
                                items: updatedItems,
                              };

                              handleAction(
                                req.requestId,
                                "APPROVED",
                                updatedReq,
                              );
                            }}
                            className="flex-1 bg-[#006c49] p-4 hover:bg-[#005a3c] text-white py-2 rounded text-sm font-semibold transition-colors"
                          >
                            {approveLoadingId === req.requestId ? (
                              <div className="flex items-center gap-2 justify-center">
                                <span className="loading loading-dots loading-xs"></span>
                              </div>
                            ) : (
                              "Approve"
                            )}
                          </button>
                          <button
                            disabled={rejectedLoadingId === req.requestId}
                            onClick={() =>
                              handleAction(req.requestId, "REJECTED", req)
                            }
                            className="flex-1 bg-red-400 p-4 hover:bg-red-600 text-white py-2 rounded text-sm font-semibold transition-colors"
                          >
                            {rejectedLoadingId === req.requestId ? (
                              <div className="flex items-center gap-2 justify-center">
                                <span className="loading loading-dots loading-xs"></span>
                              </div>
                            ) : (
                              "Reject"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-500 font-medium"
                  >
                    No pending requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs font-medium text-slate-500">
          <p>
            Showing {requests.length === 0 ? 0 : pageStart + 1}–
            {Math.min(pageStart + REQUESTS_PER_PAGE, requests.length)} of{" "}
            {requests.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-slate-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-base">
            Live Request Queue
          </h3>
          <span className="text-xs text-slate-400 ">
            {pageStart + 1}–
            {Math.min(pageStart + REQUESTS_PER_PAGE, requests.length)} of{" "}
            {requests.length}
          </span>
        </div>

        {pageItems.map((req, rIndex) => {
          const initials = getInitials(req.fullname);
          const avatarColor = getAvatarColor(req.fullname);
          return (
            <div
              key={rIndex}
              className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#e4efff] border-b border-blue-100">
                <div>
                  <span className="font-bold text-primary text-sm">
                    #{req.requestId}
                  </span>
                  <p className="text-[11px] text-blue-500 mt-0.5">
                    {fmtDate(req.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold ${avatarColor}`}
                  >
                    {initials}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">
                      {req.fullname}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {req.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-100">
                {req.items.map((item, iIndex) => {
                  const stockStatus = getStockStatus(item.stock, item.qty);
                  return (
                    <div key={iIndex} className="px-4 py-3 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.category}
                          </p>
                        </div>
                        <span className={stockBadge(stockStatus)}>
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor(
                              stockStatus,
                            )}`}
                          />
                          {stockStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>
                          Requested:{" "}
                          <strong className="text-slate-700">{item.qty}</strong>
                        </span>
                        <span>
                          Stock:{" "}
                          <strong className="text-slate-700">
                            {item.stock}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500 shrink-0">
                          Approve Qty:
                        </label>
                        <input
                          type="number"
                          required
                          value={
                            approvedQty[`${req.requestId}-${iIndex}`] ??
                            item.approveQty ??
                            item.qty
                          }
                          onChange={(e) =>
                            handleApproveQtyChange(
                              req.requestId,
                              iIndex,
                              e.target.value,
                            )
                          }
                          className="w-24 border border-blue-200 bg-blue-50/50 rounded px-2 py-1 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="px-4 py-3 border-t border-slate-100 flex gap-3">
                <button
                  disabled={approveLoadingId === req.requestId}
                  onClick={() => {
                    const updatedItems = req.items.map((item, index) => ({
                      ...item,
                      approveQty:
                        approvedQty[`${req.requestId}-${index}`] ??
                        item.approveQty ??
                        item.qty,
                    }));
                    const hasInvalidQty = updatedItems.some(
                      (item) => Number(item.approveQty) <= 0,
                    );
                    if (hasInvalidQty) {
                      toast.error("Approve quantity must be greater than 0");
                      return;
                    }
                    const updatedReq = {
                      ...req,
                      items: updatedItems,
                    };
                    handleAction(req.requestId, "APPROVED", updatedReq);
                  }}
                  className="flex-1 bg-[#006c49] p-4 hover:bg-[#005a3c] text-white py-2 rounded text-sm font-semibold transition-colors"
                >
                  {approveLoadingId === req.requestId ? (
                    <div className="flex items-center gap-2 justify-center">
                      <span className="loading loading-dots loading-xs"></span>
                    </div>
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  disabled={rejectedLoadingId === req.requestId}
                  onClick={() => handleAction(req.requestId, "REJECTED", req)}
                  className="flex-1 bg-red-400 p-4 hover:bg-red-600 text-white py-2 rounded text-sm font-semibold transition-colors"
                >
                  {rejectedLoadingId === req.requestId ? (
                    <div className="flex items-center gap-2 justify-center">
                      <span className="loading loading-dots loading-xs"></span>
                    </div>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Mobile Pagination */}
        <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3 text-xs font-medium text-slate-500 shadow-sm">
          <p>
            {pageStart + 1}–
            {Math.min(pageStart + REQUESTS_PER_PAGE, requests.length)} of{" "}
            {requests.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-1 text-slate-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
