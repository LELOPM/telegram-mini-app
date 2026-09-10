"use client";

import { useState } from "react";

type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  date: string;
};

const initialOrders: Order[] = [
  {
    id: "#1001",
    customer: "Abebe",
    items: 2,
    total: 120,
    status: "Completed",
    date: "Aug 28, 2026",
  },
  {
    id: "#1002",
    customer: "Meron",
    items: 1,
    total: 85,
    status: "Pending",
    date: "Aug 28, 2026",
  },
  {
    id: "#1003",
    customer: "Dawit",
    items: 4,
    total: 210,
    status: "Processing",
    date: "Aug 27, 2026",
  },
  {
    id: "#1004",
    customer: "Hana",
    items: 3,
    total: 65,
    status: "Completed",
    date: "Aug 27, 2026",
  },
  {
    id: "#1005",
    customer: "Samuel",
    items: 1,
    total: 45,
    status: "Cancelled",
    date: "Aug 26, 2026",
  },
];

const statuses = [
  "All",
  "Pending",
  "Processing",
  "Completed",
  "Cancelled",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("All");

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  function updateStatus(id: string, status: string) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage customer orders.
          </p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Orders" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-500">
                  Order
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Items
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Total
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-semibold">
                    {order.id}
                  </td>

                  <td className="px-5 py-4">
                    {order.customer}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {order.items}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ${order.total.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                      className="rounded-lg border bg-white px-3 py-2 text-xs outline-none"
                    >
                      {statuses
                        .filter((status) => status !== "All")
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}