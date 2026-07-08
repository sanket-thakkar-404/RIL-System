import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useInventory } from "../../../inventory/hooks/useInventory";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function ItemSearchAdd({ onAdd, alreadyAddedIds = [] }) {
  const { fetchInventory, items } = useInventory();


  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const reduxItems = useSelector((state) => state?.inventory?.items ?? []);

  const sourceItems = reduxItems.length > 0 ? reduxItems : items;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  // outside click close
  useEffect(() => {
    const close = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  const search = useCallback(
    (value) => {
      const text = value.trim().toLowerCase();

      if (!text) return [];

      return sourceItems
        .filter(
          (item) =>
            !alreadyAddedIds.includes(item.id) &&
            (item.productName.toLowerCase().includes(text) ||
              item.id.toLowerCase().includes(text) ||
              item.category.toLowerCase().includes(text)),
        )
        .slice(0, 7);
    },

    [sourceItems, alreadyAddedIds],
  );

  const results = search(debouncedQuery);

  const loading = query !== debouncedQuery;

  const selectItem = (item) => {
    onAdd(item);

    setQuery("");

    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Search & Add Items
      </label>

      {/* Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Type to search inventory..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3
          text-sm outline-none transition focus:border-blue-500 focus:ring-2
          focus:ring-blue-100"
        />
      </div>

      {/* Dropdown */}
      {open && query.trim() && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Searching */}
          {loading && <p className="p-4 text-sm text-gray-500">Searching...</p>}
          {/* Empty */}
          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No matching items found.
            </p>
          )}
          {/* Items */}
          {!loading &&
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectItem(item)}
                className="flex w-full items-center justify-between gap-4 border-b
                  border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50s"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.productName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">{item.category}</p>
                </div>

                <div className="flex items-center gap-3">

                  <Plus
                    size={16}
                    className="
                      text-blue-600
                      "
                  />
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
