import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-white p-6 md:block">
          <h1 className="mb-8 text-xl font-bold">Admin Panel</h1>

          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Products
            </Link>

            <Link
              href="/admin/categories"
              className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Categories
            </Link>

            <Link
              href="/admin/orders"
              className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Orders
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}