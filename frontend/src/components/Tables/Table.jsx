import { Paginator } from "../../features/inventory/ui/pages/StockPage";
import TableHeader from "./TableHeader";

const Table = ({
  title,
  columns,
  invItems,
  invTotalPages,
  invStart,
  ITEMS_PER_PAGE,
  invPage,
  setInvPage,
}) => {
  return (
    <div className=" flex flex-col gap-6">
      {/* ── Current Inventory ── */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden shrink-0">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 text-base sm:text-lg">
            {title}
          </h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <TableHeader columns={columns} />
            <tbody className="divide-y divide-slate-200">
              {invItems.length > 0 ? (
                invItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.productName || item.date}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.id || item.reqId}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.category || item.qty}
                    </td>
                    <td className="px-6 py-4 text-start text-slate-700">
                      {item.stock || item.user}
                    </td>
                    {item.minStock && (
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          item.status === "Low Stock"
                            ? "text-rose-600"
                            : "text-slate-700"
                        }`}
                      >
                        {item.minStock}
                      </td>
                    )}
                    {item.approver ||
                      (item.receiver && (
                        <td className="px-6 py-4">
                          <span className="font-medium text-primary hover:underline cursor-pointer">
                            {item.approver || item.receiver}
                          </span>
                        </td>
                      ))}
                    {item.stock && (
                      <td className="px-6 py-4 text-center">
                        {(() => {
                          const isLowStock = item.stock <= item.minStock;
                          return (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                                !isLowStock
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {!isLowStock ? "Healthy" : "Low Alert"}
                            </span>
                          );
                        })()}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-slate-100">
          {invItems.map((item, idx) => (
            <div key={idx} className="px-4 py-3 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800 text-sm">
                  {item.productName || item.date}
                </p>
                {item.stock && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ml-2 shrink-0 ${
                      item.stock > item.minStock
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.stock > item.minStock ? "Healthy" : "Low Alert"}
                  </span>
                )}
                {item.qty && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ml-2 shrink-0 ${"bg-emerald-100 text-emerald-800"}`}
                  >
                    {item.qty}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {item.id || item.reqId} · {item.category || item.qty}
              </p>
              <div className="flex gap-4 text-xs text-end ">
                <span className="text-slate-500 shrink-0">
                  {item.stock ? "Stock:" : "User:"}{" "}
                  <strong className="text-slate-700">
                    {item.stock || item.user}
                  </strong>
                </span>
                {item.approver ||
                  (item.receiver && (
                    <div className="flex justify-end w-full items-end">
                      <span className="font-medium text-primary  tex-xl hover:underline cursor-pointer">
                        {item.approver || item.receiver}
                      </span>
                    </div>
                  ))}
                {item.minStock && (
                  <span
                    className={`font-semibold ${
                      item.stock <= item.minStock
                        ? "text-rose-600"
                        : "text-slate-500"
                    }`}
                  >
                    Min: <strong>{item.minStock}</strong>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <Paginator
          page={invPage}
          totalPages={invTotalPages}
          onPrev={() => setInvPage((p) => Math.max(1, p - 1))}
          onNext={() => setInvPage((p) => Math.min(invTotalPages, p + 1))}
          showingText={`Showing ${invStart + 1}–${Math.min(
            invStart + ITEMS_PER_PAGE,
            invItems.length,
          )} of ${invItems.length} items`}
        />
      </div>
    </div>
  );
};

export default Table;
