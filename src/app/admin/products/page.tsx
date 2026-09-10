"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Product One",
    category: "Electronics",
    price: 120,
    stock: 15,
  },
  {
    id: 2,
    name: "Product Two",
    category: "Clothing",
    price: 85,
    stock: 24,
  },
  {
    id: 3,
    name: "Product Three",
    category: "Accessories",
    price: 45,
    stock: 8,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    const productPrice = Number(price);
    const productStock = Number(stock);

    if (!price || productPrice <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (stock === "" || productStock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      price: productPrice,
      stock: productStock,
    };

    setProducts((current) => [...current, newProduct]);

    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setShowForm(false);
  }

  function deleteProduct(id: number) {
    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products.
          </p>
        </div>

        <button
          onClick={() => setShowForm((current) => !current)}
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="mb-6 rounded-xl border bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-semibold">
            Add Product
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              className="rounded-lg border p-3 outline-none focus:ring-2"
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border p-3 outline-none focus:ring-2"
                required
                >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Food">Food</option>
            </select>

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              className="rounded-lg border p-3 outline-none focus:ring-2"
            />

            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              min="0"
              placeholder="Stock"
              className="rounded-lg border p-3 outline-none focus:ring-2"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Add Product
          </button>
        </form>
      )}

      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            All Products ({products.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-500">
                  Product
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Category
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Price
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Stock
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {product.category}
                  </td>

                  <td className="px-5 py-4">
                    ${product.price.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    {product.stock}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-sm font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}