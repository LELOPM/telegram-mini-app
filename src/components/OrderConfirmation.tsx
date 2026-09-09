"use client";
import Link from "next/link";
import type { OrderConfirmation } from "@/app/actions/checkout";

interface OrderConfirmationProps {
  order: OrderConfirmation;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We'll contact you soon to confirm delivery.
        </p>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <h2 className="font-semibold">Order Details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Checkout ID</span>
            <span className="font-mono text-xs">
              {order.checkoutId.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {order.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Placed</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <h2 className="font-semibold">Customer Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span>{order.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Address</span>
            <span>{order.deliveryAddress}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <h2 className="font-semibold">Order Items</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border/50"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} x ETB {item.price.toLocaleString()}
                </p>
              </div>
              <p className="font-medium text-right">
                ETB {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-border pt-4">
          <span>Total</span>
          <span>ETB {order.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-amber-50 text-amber-700 text-sm">
        <p className="font-medium">Payment on Delivery</p>
        <p>
          No payment is required now. You will pay when your order is delivered.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          href="/"
          className="block w-full py-3 px-4 bg-black text-white font-medium rounded-lg text-center transition-colors hover:opacity-90"
        >
          Continue Shopping
        </Link>
        <Link
          href="/cart"
          className="block w-full py-3 px-4 border border-border text-foreground font-medium rounded-lg text-center transition-colors hover:bg-muted"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
