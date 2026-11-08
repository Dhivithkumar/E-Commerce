"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, Search, CheckCircle, Package, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  total: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  createdAt: string;
  itemsCount: number;
  shippingCountry: string;
}

export default function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: OrderItem[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusChange = async (orderId: string, newStatus: string) => {
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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || o.fulfillmentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-elora-border gap-4">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Fulfillment Operations
          </span>
          <h1 className="font-editorial text-3xl text-elora-charcoal mt-0.5">
            Client Order Management
          </h1>
          <p className="text-xs text-elora-gray">
            Track compounding, dispatch, and global courier handoffs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search order #, client, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-elora-surface border border-elora-border px-3.5 py-2 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-elora-surface border border-elora-border px-3 py-2 text-xs text-elora-charcoal focus:outline-none rounded-sm"
          >
            <option value="all">All Statuses</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-elora-surface border border-elora-border rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-elora-charcoal">
            <thead className="bg-elora-cream/40 uppercase text-[10px] tracking-wider text-elora-gray border-b border-elora-border/60">
              <tr>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Courier Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-elora-border/50">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-elora-cream/20">
                  <td className="py-3.5 px-4 font-mono font-medium text-elora-charcoal">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-elora-gray">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium">{ord.customerName}</p>
                    <p className="text-[10px] text-elora-gray">{ord.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-elora-taupe">
                    {ord.shippingCountry}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{formatPrice(ord.total)}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.fulfillmentStatus}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="bg-elora-ivory border border-elora-border text-[11px] rounded px-2.5 py-1 text-elora-charcoal focus:outline-none cursor-pointer"
                    >
                      <option value="UNFULFILLED">Unfulfilled</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/checkout/confirmation/${ord.orderNumber}`}
                      className="text-xs text-elora-taupe hover:underline uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      <span>Receipt</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

