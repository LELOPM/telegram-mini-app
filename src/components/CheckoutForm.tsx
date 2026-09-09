"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTransition } from "react";
import { placeOrderAction } from "@/app/actions/checkout";

interface CheckoutFormProps {
  items: Array<{
    id: string;
    quantity: number;
    products: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
  }>;
  total: number;
}

export default function CheckoutForm({ items, total }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    deliveryAddress: "",
  });
  const router = useRouter();

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.customerName.trim()) {
      setError("Customer name is required");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setError("Delivery address is required");
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setError("Telegram session not ready. Please try again.");
      return;
    }

    const checkoutId = crypto.randomUUID();

    startTransition(async () => {
      const result = await placeOrderAction({
        initData,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        deliveryAddress: formData.deliveryAddress.trim(),
        checkoutId,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/checkout/confirmation?orderId=${result.orderId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Customer Information</h2>

        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium mb-1"
          >
            Full Name *
          </label>
          <input
            id="customerName"
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your full name"
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your phone number"
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="deliveryAddress"
            className="block text-sm font-medium mb-1"
          >
            Delivery Address *
          </label>
          <textarea
            id="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={(e) => handleChange("deliveryAddress", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your full delivery address"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="border-t border-border pt-6 space-y-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 border-b border-border/50"
            >
              <img
                src={item.products.image}
                alt={item.products.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.products.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ETB{" "}
                  {item.products.price.toLocaleString()}
                </p>
              </div>
              <p className="font-medium text-right">
                ETB {(item.products.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-lg font-semibold border-t border-border pt-4">
          <span>Total</span>
          <span>ETB {total.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <>
              <span className="inline-flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Placing Order...
              </span>
            </>
          ) : (
            "Place Order"
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          No payment required now. Pay on delivery.
        </p>
      </div>
    </form>
  );
}
