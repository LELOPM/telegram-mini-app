const stats = [
  { name: "Total Products", value: "24" },
  { name: "Categories", value: "6" },
  { name: "Orders", value: "48" },
  { name: "Revenue", value: "$2,450" },
];

const recentOrders = [
  { id: "#1001", customer: "Abebe", status: "Completed", total: "$120" },
  { id: "#1002", customer: "Meron", status: "Pending", total: "$85" },
  { id: "#1003", customer: "Dawit", status: "Processing", total: "$210" },
  { id: "#1004", customer: "Hana", status: "Completed", total: "$65" },
];

const topProducts = [
  { name: "Product One", sold: 32, revenue: "$640" },
  { name: "Product Two", sold: 24, revenue: "$480" },
  { name: "Product Three", sold: 18, revenue: "$360" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="min-w-0 rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="truncate text-sm font-medium text-gray-500">
              {stat.name}
            </p>

            <p className="mt-3 break-words text-2xl font-bold leading-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main sections */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm lg:col-span-2">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest orders from your store.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Order
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {order.customer}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Top Products</h2>
            <p className="mt-1 text-sm text-gray-500">
              Best performing products.
            </p>
          </div>

          <div className="divide-y">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {index + 1}. {product.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.sold} sold
                  </p>
                </div>

                <p className="shrink-0 font-semibold">
                  {product.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Sales Summary</h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Today</p>
            <p className="mt-1 text-2xl font-bold">$320</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">This Week</p>
            <p className="mt-1 text-2xl font-bold">$1,240</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">This Month</p>
            <p className="mt-1 text-2xl font-bold">$2,450</p>
          </div>
        </div>
      </div>
    </div>
  );
}