// src/features/move-history/MoveHistory.jsx
import React, { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import WidgetsIcon from "@mui/icons-material/Widgets";

/**
 * MoveHistory page (frontend-only)
 * - List view (default)
 * - Kanban view (grouped by status)
 * - Search by reference | contact
 * - Row color: IN -> green-ish, OUT -> red-ish
 *
 * Swap `mockMoves` with real API data when backend exists.
 */

const mockMoves = [
  {
    id: 1,
    reference: "WH/IN/0001",
    date: "2025-11-20",
    contact: "Azure Interior",
    from: "vendor",
    to: "WH/Stock1",
    quantity: 10,
    status: "Ready",
    products: [
      { sku: "P-100", qty: 5 },
      { sku: "P-101", qty: 5 },
    ],
  },
  {
    id: 2,
    reference: "WH/OUT/0002",
    date: "2025-11-19",
    contact: "Azure Interior",
    from: "WH/Stock1",
    to: "vendor",
    quantity: 4,
    status: "In Progress",
    products: [{ sku: "P-102", qty: 4 }],
  },
  {
    id: 3,
    reference: "WH/OUT/0003",
    date: "2025-11-18",
    contact: "Acme Corp",
    from: "WH/Stock2",
    to: "vendor",
    quantity: 2,
    status: "Ready",
    products: [{ sku: "P-103", qty: 2 }],
  },
  {
    id: 4,
    reference: "WH/IN/0004",
    date: "2025-11-17",
    contact: "Main Supplier",
    from: "vendor",
    to: "WH/Stock2",
    quantity: 18,
    status: "Completed",
    products: [{ sku: "P-104", qty: 18 }],
  },
];

const statusOrder = ["Ready", "In Progress", "Completed", "Cancelled"];

const badgeColorByRef = (ref) => {
  if (!ref) return "bg-gray-700";
  if (ref.includes("IN")) return "bg-emerald-600/80 text-emerald-100";
  if (ref.includes("OUT")) return "bg-red-600/80 text-red-100";
  return "bg-gray-600/80 text-gray-100";
};

const MoveHistory = () => {
  const [view, setView] = useState("list"); // 'list' | 'kanban'
  const [query, setQuery] = useState("");
  const [moves] = useState(mockMoves);

  // filtered & searchable list
  const filtered = useMemo(() => {
    if (!query.trim()) return moves;
    const q = query.toLowerCase();
    return moves.filter(
      (m) =>
        (m.reference && m.reference.toLowerCase().includes(q)) ||
        (m.contact && m.contact.toLowerCase().includes(q))
    );
  }, [query, moves]);

  // grouped by status for kanban
  const grouped = useMemo(() => {
    const map = {};
    statusOrder.forEach((s) => (map[s] = []));
    // put unknown statuses at the end
    filtered.forEach((m) => {
      const s = statusOrder.includes(m.status) ? m.status : "Other";
      if (!map[s]) map[s] = [];
      map[s].push(m);
    });
    return map;
  }, [filtered]);

  return (
    <div className="flex justify-center w-full px-4 py-10">
      <div className="w-full p-8 rounded-2xl shadow-2xl bg-gray-800/55 border border-gray-700 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded font-semibold"
              onClick={() => {
                // new move — placeholder
                alert("Open New Move modal (implement later)");
              }}
            >
              NEW
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
              Move History
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center bg-gray-900/60 border border-gray-700 rounded px-2 py-1">
              <SearchIcon className="text-gray-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reference or contact..."
                className="ml-2 bg-transparent outline-none text-sm placeholder-gray-400"
              />
            </div>

            {/* View toggles */}
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded ${
                view === "list"
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-gray-700/40"
              }`}
              title="List view"
            >
              <ViewListIcon />
            </button>

            <button
              onClick={() => setView("kanban")}
              className={`p-2 rounded ${
                view === "kanban"
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-gray-700/40"
              }`}
              title="Kanban view"
            >
              <WidgetsIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        {view === "list" ? (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-xl text-gray-300 border-b border-gray-700 bg-gray-700">
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">From</th>
                  <th className="py-3 px-3">To</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">
                      No moves found.
                    </td>
                  </tr>
                )}

                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className={`align-top border-b border-gray-700 hover:bg-gray-900/30`}
                  >
                    <td className="py-4 px-3">
                      <div className="flex flex-col">
                        <span className="font-semibold">{m.reference}</span>
                        <small className="text-gray-400">
                          {m.products.length} product(s)
                        </small>
                      </div>
                    </td>

                    <td className="py-4 px-3">{m.date}</td>
                    <td className="py-4 px-3">{m.contact}</td>
                    <td className="py-4 px-3">{m.from}</td>
                    <td className="py-4 px-3">{m.to}</td>
                    <td className="py-4 px-3">{m.quantity}</td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${badgeColorByRef(
                          m.reference
                        )}`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Kanban view
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(grouped).map((status) => {
              const list = grouped[status];
              if (!list || list.length === 0) return null;
              return (
                <div
                  key={status}
                  className="bg-gray-900/40 rounded p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{status}</h3>
                    <span className="text-sm text-gray-400">{list.length}</span>
                  </div>

                  <div className="space-y-3">
                    {list.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded bg-gray-800/60 border border-gray-700 hover:shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded text-xs ${badgeColorByRef(
                                  m.reference
                                )}`}
                              >
                                {m.reference}
                              </span>
                              <small className="text-gray-400">{m.date}</small>
                            </div>

                            <div className="text-sm text-gray-200">
                              <div>
                                <strong>Contact:</strong> {m.contact}
                              </div>
                              <div>
                                <strong>From:</strong> {m.from} →{" "}
                                <strong>To:</strong> {m.to}
                              </div>
                              <div>
                                <strong>Qty:</strong> {m.quantity}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <button
                              className="text-xs px-2 py-1 rounded bg-yellow-400 text-black font-semibold"
                              onClick={() =>
                                alert(`Open details for ${m.reference}`)
                              }
                            >
                              Details
                            </button>
                          </div>
                        </div>

                        {/* list of products if any */}
                        {m.products && m.products.length > 0 && (
                          <div className="mt-3 text-xs text-gray-300">
                            {m.products.map((p, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{p.sku}</span>
                                <span>×{p.qty}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;