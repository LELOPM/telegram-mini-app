"use client";

import { useState } from "react";

const initialCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Accessories" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (
      categories.some(
        (category) =>
          category.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setError("This category already exists.");
      return;
    }

    setCategories((current) => [
      ...current,
      {
        id: Date.now(),
        name: trimmedName,
      },
    ]);

    setName("");
  }

  function handleDelete(id: number) {
    setCategories((current) =>
      current.filter((category) => category.id !== id)
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your product categories.
        </p>
      </div>

      {/* Add Category */}
      <form
        onSubmit={handleAdd}
        className="mb-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold">Add Category</h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="min-w-0 flex-1 rounded-lg border p-3 outline-none focus:ring-2"
          />

          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Add Category
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </form>

      {/* Category List */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            All Categories ({categories.length})
          </h2>
        </div>

        <div className="divide-y">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <span className="font-medium">{category.name}</span>

              <button
                onClick={() => handleDelete(category.id)}
                className="shrink-0 text-sm font-medium text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="p-8 text-center text-sm text-gray-500">
              No categories found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}