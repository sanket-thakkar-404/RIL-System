import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import { useEffect } from "react";
import Table from "../../../../components/Tables/Table";
import { inventoryCols } from "../../../../data/table";
// import { toast } from "sonner";
// import alertSound from "../../../../assets/alert.wav";

const ITEMS_PER_PAGE = 10;

export const Paginator = ({
  page,
  totalPages,
  onPrev,
  onNext,
  showingText,
}) => (
  <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs font-medium text-slate-500">
    <p>{showingText}</p>
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="px-2 text-slate-600">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const StockPage = () => {
  const { fetchInventory, items } = useInventory();
  const [invPage, setInvPage] = useState(1);

  useEffect(() => {
    fetchInventory();
  }, []);
  // useEffect(() => {
  //   if (items.length > 0) {
  //     const lowStockItems = items.filter((item) => item.stock <= item.minStock);
  //     lowStockItems.forEach((item, index) => {
  //       // delay taki ek sath spam na ho
  //       setTimeout(() => {
  //         // 🔊 play sound
  //         const audio = new Audio(alertSound);
  //         audio.play().catch(() => {
  //           console.log("sound blocked");
  //         });
  //         // 🔔 separate notification
  //         toast.warning("Low Stock Alert 🚨", {
  //           description: `${item.productName} only ${item.stock} left`,
  //         });
  //       }, index * 1000);
  //     });
  //   }
  // }, [items]);

  // Inventory pagination
  const invTotalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const invStart = (invPage - 1) * ITEMS_PER_PAGE;
  const [search, setSearch] = useState("");
  const filteredItems = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  const invItems = filteredItems.slice(invStart, invStart + ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Stock Levels &amp; History
          </h2>
          <p className="text-slate-600 font-medium text-sm">
            Real-time inventory tracking and audit log.
          </p>
        </div>
        {/* Search Box */}

        <div className="w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search item, product id..."
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
      <Table
        title="Current Inventory"
        columns={inventoryCols}
        invItems={invItems}
        invStart={invStart}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        invTotalPages={invTotalPages}
        items={items}
        invPage={invPage}
        setInvPage={setInvPage}
      />
    </div>
  );
};

export default StockPage;
