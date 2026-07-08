import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  X,
  Trash2,
  Save,
  ShoppingCart,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useInventory } from "../../hooks/useInventory";
import { UNIT } from "../../../../data/unit";

// ─── Product Catalog ────────────────────────────────────────────────────────

// ─── Helpers ────────────────────────────────────────────────────────────────
const genPoId = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PO-${dateStr}-${rand}`;
};

const genProductId = (catalog) => {
  if (!catalog || catalog.length === 0) return "PRD-001";
  const max = catalog.reduce((acc, p) => {
    const id = p.productId || p.id;
    if (!id || !id.startsWith("PRD-")) return acc;
    const n = parseInt(id.replace("PRD-", ""), 10);
    return !isNaN(n) && n > acc ? n : acc;
  }, 0);
  return `PRD-${String(max + 1).padStart(3, "0")}`;
};

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─── Add Product Modal ───────────────────────────────────────────────────────
const AddProductModal = ({ onClose, onAdd, catalog, initialName }) => {
  const [form, setForm] = useState({
    productName: initialName || "",
    category: "Electronics",
    unit: "pcs",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName.trim()) return;
    const newProduct = {
      productId: genProductId(catalog),
      ...form,
      stock: 0,
      productName: form.productName.trim(),
    };
    await onAdd(newProduct);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[95%] sm:w-[450px] shrink-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
              <Package size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">
              Add New Product
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) =>
                setForm({ ...form, productName: e.target.value })
              }
              placeholder="e.g. Precision Resistor 10kΩ"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
            >
              {[
                "Welding Consumables",
                "Safety & PPE",
                "Foundry Coatings & Chemicals",
                "Sand & Foundry Raw Material",
                "Miscellaneous",
                "Exothermic Sleeves",
                "Bearings",
                "Oils & Lubricants",
                "Paints & Coatings",
                "Cutting Tools & Inserts",
                "Packaging Materials",
                "Tapes, Ropes & Threads",
                "Gas Cylinders",
                "Chaplets",
                "Fasteners",
                "Electrical Components",
                "Abrasives & Grinding",
                "Laboratory Chemicals & Consumables",
                "Rubber & Plastic Items",
                "Refractory & Furnace Materials",
                "Hoses & Pipes",
                "Torch & Cutting Equipment",
                "Pneumatic & Hydraulic Fittings",
                "V-Belts & Power Transmission",
                "Valves",
                "Fans & Cooling",
                "Motors & Drives",
                "Machine Spare Parts",
                "Seals, Gaskets & O-Rings",
                "Hand Tools",
                "Chemicals - Ferro Alloys",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              ID Start with Series *
            </label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) =>
                setForm({ ...form, productName: e.target.value })
              }
              placeholder="C012001"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Unit
            </label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
            >
              {UNIT.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#00288e] hover:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

// ─── Product Search Dropdown ─────────────────────────────────────────────────
const ProductSearch = ({ catalog, onSelect, onAddNew }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered =
    query.trim().length > 0
      ? catalog.filter((p) => {
          const searchId = p.productId || p.id || "";
          return (
            p.productName.toLowerCase().includes(query.toLowerCase()) ||
            searchId.toLowerCase().includes(query.toLowerCase())
          );
        })
      : [];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (product) => {
    onSelect(product);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center border border-slate-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <Search size={16} className="ml-3 text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          placeholder="Search product by name or ID..."
          className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="mr-2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            <>
              {filtered.map((p) => (
                <button
                  key={p.productId}
                  onClick={() => handleSelect(p)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 flex justify-between items-center border-b border-slate-100 last:border-0 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {p.productName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.productId || p.id} · {p.category}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {p.unit}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  onAddNew(query);
                }}
                className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-emerald-700 font-semibold text-sm flex items-center gap-2 border-t border-slate-200"
              >
                <Plus size={14} /> Add "{query}" as new product
              </button>
            </>
          ) : (
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-slate-500 mb-3">
                No product found for "{query}"
              </p>
              <button
                onClick={() => {
                  setOpen(false);
                  onAddNew(query);
                }}
                className="inline-flex items-center gap-2 bg-[#00288e] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus size={14} /> Add as New Product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const PurchasePage = () => {
  const {
    fetchInventory,
    items: inventoryItems,
    onSubmitInventory,
  } = useInventory();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const catalog = inventoryItems || [];

  const [poId] = useState(genPoId);
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalInitial, setAddModalInitial] = useState("");

  // ── Item Helpers ──
  const addItem = (product) => {
    const productId = product.productId || product.id;
    if (items.find((i) => (i.productId || i.id) === productId)) {
      toast.error("Product already added to this order.");
      return;
    }
    setItems((prev) => [
      ...prev,
      { ...product, productId, qty: 1, rate: "", total: 0 },
    ]);
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => (i.productId || i.id) !== productId));
  };

  const updateItem = (productId, field, value) => {
    setItems((prev) =>
      prev.map((i) => {
        if ((i.productId || i.id) !== productId) return i;
        const updated = { ...i, [field]: value };
        updated.total =
          (parseFloat(updated.qty) || 0) * (parseFloat(updated.rate) || 0);
        return updated;
      }),
    );
  };

  const grandTotal = items.reduce((sum, i) => sum + (i.total || 0), 0);

  // ── Add New Product to catalog ──
  const handleAddNewProduct = async (newProduct) => {
    if (onSubmitInventory) {
      await onSubmitInventory(newProduct);
      toast.success(`Product "${newProduct.productName}" added to inventory`);
      fetchInventory();
    }
    addItem(newProduct);
  };

  // ── Save PO ──
  const handleSave = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }
    const hasEmpty = items.some((i) => !i.qty || !i.rate);
    if (hasEmpty) {
      toast.error("Please fill Qty and Rate for all items");
      return;
    }
    toast.success(`Purchase Order ${poId} saved successfully!`);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
              <ShoppingCart size={22} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              New Purchase Order
            </h2>
          </div>
          <p className="text-slate-500 text-sm ml-12">
            Create and manage purchase orders for inventory procurement.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-5 py-3 shadow-sm text-center shrink-0">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">
            PURCHASE ORDER ID
          </p>
          <p className="font-bold text-[#00288e] text-base font-mono">{poId}</p>
        </div>
      </div>

      {/* ── Product Search Card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Add Products
          </h3>
          <button
            onClick={() => {
              setAddModalInitial("");
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#00288e] border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus size={14} /> Add New Product
          </button>
        </div>
        <ProductSearch
          catalog={catalog}
          onSelect={addItem}
          onAddNew={(q) => {
            setAddModalInitial(q);
            setShowAddModal(true);
          }}
        />
        {items.length === 0 && (
          <p className="text-center text-slate-400 text-sm mt-8 mb-2">
            Search and add products above to start building your purchase order.
          </p>
        )}
      </div>

      {/* ── Items Table ── */}
      {items.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Order Items</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#e4efff] text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3 w-24 text-center">Qty</th>
                  <th className="px-6 py-3 w-32 text-right">Rate / Unit (₹)</th>
                  <th className="px-6 py-3 w-32 text-right">Total (₹)</th>
                  <th className="px-6 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {item.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {item.productName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.productId} · {item.category}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(item.productId, "qty", e.target.value)
                          }
                          className="w-16 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-xs text-slate-400">
                          {item.unit}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.productId, "rate", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      ₹{fmt(item.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Items */}
          <div className="sm:hidden divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div key={item.productId} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-mono mb-0.5">
                      #{idx + 1} · {item.productId}
                    </p>
                    <p className="font-semibold text-slate-800">
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-400">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Qty ({item.unit})
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.productId, "qty", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Rate (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.productId, "rate", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm text-right focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Total
                    </label>
                    <p className="border border-slate-100 bg-slate-50 rounded-lg px-2 py-2 text-sm text-right font-bold text-slate-700">
                      ₹{fmt(item.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <p className="font-semibold text-slate-600 text-sm">Grand Total</p>
            <p className="text-2xl font-bold text-[#00288e]">
              ₹{fmt(grandTotal)}
            </p>
          </div>
        </div>
      )}

      {/* ── Action Buttons ── */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-on-primary-container text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors shadow-md"
          >
            <Save size={18} /> Save Purchase Order
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          catalog={catalog}
          initialName={addModalInitial}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddNewProduct}
        />
      )}
    </div>
  );
};

export default PurchasePage;
