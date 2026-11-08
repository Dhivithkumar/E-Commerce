"use client";

import React, { useState } from "react";
import { Plus, AlertTriangle, Check, Layers, History } from "lucide-react";

interface VariantItem {
  id: string; // variantId
  productName: string;
  variantTitle: string;
  sku: string;
  price: number;
  stock: number;
  reorderThreshold: number;
}

interface StockMovementItem {
  id: string;
  productName: string;
  type: string;
  quantity: number;
  note?: string | null;
  createdAt: string;
}

export default function AdminInventoryClient({
  initialVariants,
  movements,
}: {
  initialVariants: VariantItem[];
  movements: StockMovementItem[];
}) {
  const [variants, setVariants] = useState(initialVariants);
  const [restockAmount, setRestockAmount] = useState<Record<string, number>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRestock = async (variantId: string) => {
    const qty = restockAmount[variantId] || 25;
    try {
      const res = await fetch(`/api/admin/inventory/${variantId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty, note: `Atelier restock +${qty}` }),
      });
      const data = await res.json();
      if (res.ok) {
        setVariants((prev) =>
          prev.map((v) => (v.id === variantId ? { ...v, stock: data.newStock } : v))
        );
        setSuccessMsg(`Successfully replenished ${qty} units.`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
          Warehouse Reserves
        </span>
        <h1 className="font-editorial text-3xl text-elora-charcoal mt-0.5">
          Inventory Ledger & Stock Movement
        </h1>
        <p className="text-xs text-elora-gray">Real-time batch allocation and audit logs</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-elora-surface border border-elora-border rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-elora-border/60 flex items-center justify-between">
          <h3 className="font-editorial text-xl text-elora-charcoal">
            Active Variant Stock Levels
          </h3>
          <span className="text-xs text-elora-gray">{variants.length} SKU Allocations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-elora-charcoal">
            <thead className="bg-elora-cream/40 uppercase text-[10px] tracking-wider text-elora-gray border-b border-elora-border/60">
              <tr>
                <th className="py-3 px-4">Formulation</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Stock on Hand</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-elora-border/50">
              {variants.map((v) => {
                const isLow = v.stock <= v.reorderThreshold;
                return (
                  <tr key={v.id} className="hover:bg-elora-cream/20">
                    <td className="py-3 px-4">
                      <p className="font-medium">{v.productName}</p>
                      <p className="text-[11px] text-elora-gray">{v.variantTitle}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-elora-charcoal">{v.sku}</td>
                    <td className="py-3 px-4 font-semibold text-sm">{v.stock} units</td>
                    <td className="py-3 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Low Stock Alert</span>
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          Adequate
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <input
                          type="number"
                          min="5"
                          step="5"
                          defaultValue="25"
                          onChange={(e) =>
                            setRestockAmount({
                              ...restockAmount,
                              [v.id]: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-16 bg-elora-ivory border border-elora-border px-2 py-1 text-xs text-center rounded-sm"
                        />
                        <button
                          onClick={() => handleRestock(v.id)}
                          className="px-3 py-1 bg-elora-charcoal text-elora-ivory hover:bg-elora-taupe text-[11px] uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Restock</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Audit Log */}
      <div className="bg-elora-surface border border-elora-border rounded-sm shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-elora-border/60">
          <History className="w-4 h-4 text-elora-taupe" />
          <h3 className="font-editorial text-xl text-elora-charcoal">
            Recent Stock Movement Audit Trail
          </h3>
        </div>

        <div className="divide-y divide-elora-border/50 text-xs">
          {movements.map((m) => (
            <div key={m.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-elora-charcoal">{m.productName}</p>
                <p className="text-[11px] text-elora-gray">{m.note || m.type}</p>
              </div>
              <div className="text-right">
                <span
                  className={`font-mono font-semibold ${
                    m.quantity > 0 ? "text-emerald-700" : "text-amber-800"
                  }`}
                >
                  {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                </span>
                <p className="text-[10px] text-elora-gray">
                  {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

