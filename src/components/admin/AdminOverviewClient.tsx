"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Package,
  Users,
  Sparkles,
  Send,
  Plus,
  Check,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AdminOverviewProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockCount: number;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    currency: string;
    fulfillmentStatus: string;
    paymentStatus: string;
    createdAt: string;
    itemsCount: number;
  }[];
  lowStockVariants: {
    id: string;
    title: string;
    productName: string;
    stock: number;
    sku: string;
  }[];
}

export default function AdminOverviewClient({
  stats,
  recentOrders: initialOrders,
  lowStockVariants: initialLowStock,
}: AdminOverviewProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [lowStock, setLowStock] = useState(initialLowStock);

  // AI BI state
  const [biQuery, setBiQuery] = useState("");
  const [biResponse, setBiResponse] = useState<string | null>(null);
  const [biLoading, setBiLoading] = useState(false);

  // Quick order status update
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillmentStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o))
        );
      }
    } catch {
      // ignore
    }
  };

  // Quick Restock
  const handleRestock = async (variantId: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/${variantId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 25, note: "Quick dashboard restock +25" }),
      });
      const data = await res.json();
      if (res.ok) {
        setLowStock((prev) =>
          prev.map((v) => (v.id === variantId ? { ...v, stock: data.newStock } : v))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleAskBI = async (queryText?: string) => {
    const q = (queryText || biQuery).trim();
    if (!q || biLoading) return;

    setBiLoading(true);
    setBiResponse(null);

    try {
      const res = await fetch("/api/admin/ai-bi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setBiResponse(data.answer);
      if (!queryText) setBiQuery("");
    } catch {
      setBiResponse("Unable to aggregate analytics at this moment.");
    } finally {
      setBiLoading(false);
    }
  };

  const sampleQueries = [
    "What is our revenue and average order value?",
    "Which formulations are our top sellers?",
    "Which products require immediate restock?",
    "Fulfillment breakdown across orders",
  ];

  return (
    <div className="space-y-8">
      {/* Top Title */}
      <div>
        <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
          Executive Operations
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-1">
          Atelier Commercial Dashboard
        </h1>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-elora-surface border border-elora-border/80 rounded-sm shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Realized Revenue</p>
            <h3 className="font-editorial text-3xl text-elora-charcoal font-medium mt-1">
              {formatPrice(stats.totalRevenue)}
            </h3>
            <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Verified Paid Transactions</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-elora-cream flex items-center justify-center text-elora-taupe">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-elora-surface border border-elora-border/80 rounded-sm shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Total Orders</p>
            <h3 className="font-editorial text-3xl text-elora-charcoal font-medium mt-1">
              {stats.totalOrders}
            </h3>
            <p className="text-[11px] text-elora-gray mt-1">Across 5 International Territories</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-elora-cream flex items-center justify-center text-elora-taupe">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-elora-surface border border-elora-border/80 rounded-sm shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Avg Order Value</p>
            <h3 className="font-editorial text-3xl text-elora-charcoal font-medium mt-1">
              {formatPrice(stats.avgOrderValue)}
            </h3>
            <p className="text-[11px] text-elora-forest mt-1">High Regimen Adoption</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-elora-cream flex items-center justify-center text-elora-taupe">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-elora-surface border border-elora-border/80 rounded-sm shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Low Stock Alerts</p>
            <h3 className="font-editorial text-3xl text-elora-charcoal font-medium mt-1">
              {stats.lowStockCount}
            </h3>
            <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Below 40 Units Threshold</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AI Business Intelligence Assistant Console */}
      <section id="ai-bi" className="bg-elora-forest text-elora-ivory p-6 sm:p-8 rounded-sm shadow-luxury space-y-4 border border-elora-sand/20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-ultra text-elora-sand font-medium">
          <Sparkles className="w-4 h-4 text-elora-sand" />
          <span>AI Business Intelligence Executive Assistant</span>
        </div>

        <div className="max-w-2xl">
          <h2 className="font-editorial text-2xl sm:text-3xl text-elora-ivory">
            Autonomous Commerce Analytics & Forecasting
          </h2>
          <p className="text-xs text-elora-sand/80 mt-1 leading-relaxed font-sans">
            Ask complex natural language questions. The AI assistant selects authorized read-only database query aggregation tools and returns structured intelligence.
          </p>
        </div>

        {/* Quick Question Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {sampleQueries.map((q) => (
            <button
              key={q}
              onClick={() => handleAskBI(q)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-elora-sand/30 text-elora-sand text-xs rounded-sm transition-colors text-left"
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}
        </div>

        {/* Inquiry Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskBI();
          }}
          className="flex gap-2 pt-2"
        >
          <input
            type="text"
            placeholder="Ask regarding revenue, product velocity, AOV trends, or inventory levels..."
            value={biQuery}
            onChange={(e) => setBiQuery(e.target.value)}
            className="flex-1 bg-white/10 border border-elora-sand/30 px-4 py-2.5 text-xs text-elora-ivory placeholder:text-elora-sand/50 focus:outline-none focus:border-elora-sand rounded-sm"
          />
          <button
            type="submit"
            disabled={biLoading || !biQuery.trim()}
            className="px-6 py-2.5 bg-elora-sand text-elora-forest text-xs uppercase tracking-luxury hover:bg-elora-ivory transition-colors font-medium flex items-center gap-1.5 rounded-sm disabled:opacity-50"
          >
            {biLoading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Query</span>
              </>
            )}
          </button>
        </form>

        {/* Structured Answer Presentation */}
        {biResponse && (
          <div className="p-5 bg-white/10 border border-elora-sand/40 rounded-sm text-xs text-elora-ivory leading-relaxed font-sans mt-3 whitespace-pre-line animate-fade-in">
            <span className="text-[10px] uppercase tracking-ultra text-elora-sand font-semibold block mb-1">
              Executive AI Analysis
            </span>
            {biResponse}
          </div>
        )}
      </section>

      {/* Main Tables Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-elora-surface border border-elora-border p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-elora-border/60">
            <div>
              <h3 className="font-editorial text-2xl text-elora-charcoal">
                Recent Orders
              </h3>
              <p className="text-xs text-elora-gray">Real-time fulfillment and international status</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-elora-taupe hover:underline uppercase tracking-wider"
            >
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-elora-charcoal">
              <thead className="bg-elora-cream/40 uppercase text-[10px] tracking-wider text-elora-gray border-b border-elora-border/60">
                <tr>
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Update Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-elora-border/50">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-elora-cream/20">
                    <td className="py-3 px-3 font-mono font-medium">{ord.orderNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium">{ord.customerName}</p>
                      <p className="text-[10px] text-elora-gray">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-3 font-medium">{formatPrice(ord.total)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                          ord.fulfillmentStatus === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-800"
                            : ord.fulfillmentStatus === "SHIPPED"
                            ? "bg-blue-50 text-blue-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {ord.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={ord.fulfillmentStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="bg-elora-ivory border border-elora-border text-[11px] rounded px-2 py-1 text-elora-charcoal focus:outline-none"
                      >
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-elora-surface border border-elora-border p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-elora-border/60">
            <div>
              <h3 className="font-editorial text-2xl text-elora-charcoal">
                Inventory Alerts
              </h3>
              <p className="text-xs text-elora-gray">Allocations below threshold</p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs text-elora-taupe hover:underline uppercase tracking-wider"
            >
              Full Ledger &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-xs text-emerald-800 py-4">All formulations adequately stocked.</p>
            ) : (
              lowStock.map((v) => (
                <div
                  key={v.id}
                  className="p-3 bg-elora-cream/30 border border-elora-border/70 rounded-sm flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-medium text-elora-charcoal line-clamp-1">{v.productName}</h4>
                    <p className="text-[11px] text-elora-gray">{v.title}</p>
                    <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                      {v.stock} units remaining
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestock(v.id)}
                    className="px-3 py-1.5 bg-elora-charcoal text-elora-ivory hover:bg-elora-taupe text-[10px] uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+25</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

