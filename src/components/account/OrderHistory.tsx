"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { CustomerOrder } from "@/lib/shopify/customer";
import { formatPrice, formatDate } from "@/lib/shopify";

export function OrderHistory() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/account/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
          console.log(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "paid" || statusLower === "fulfilled") {
      return "bg-green-100 text-green-700";
    }
    if (statusLower === "pending" || statusLower === "unfulfilled") {
      return "bg-yellow-100 text-yellow-700";
    }
    if (statusLower === "refunded" || statusLower === "cancelled") {
      return "bg-red-100 text-red-700";
    }
    return "bg-muted text-muted-foreground";
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">When you place your first order, it will appear here.</p>
        <Link
          href="/collections/all"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-border rounded-lg overflow-hidden">
          {/* Order Header */}
          <button
            onClick={() => toggleOrderExpand(order.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-muted">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium">{order.name}</div>
                <div className="text-sm text-muted-foreground">{formatDate(order.processedAt, "en-US")}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium">{formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}</div>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.financialStatus)}`}>
                    {order.financialStatus?.replace("_", " ")}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.fulfillmentStatus)}`}>
                    {order.fulfillmentStatus?.replace("_", " ") || "Processing"}
                  </span>
                </div>
              </div>
              {expandedOrder === order.id ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Order Details */}
          {expandedOrder === order.id && (
            <div className="border-t border-border p-4 bg-muted/30">
              {/* Line Items */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-sm">Items</h4>
                {order.lineItems.edges.map((edge, index) => {
                  const item = edge.node;
                  return (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                        {item.variant?.image?.url ? (
                          <Image
                            src={item.variant.image.url}
                            alt={item.variant.image.altText || item.title}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.title}</div>
                        {item.variant?.title && item.variant.title !== "Default Title" && (
                          <div className="text-xs text-muted-foreground">{item.variant.title}</div>
                        )}
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      {item.variant?.price && (
                        <div className="text-sm font-medium">
                          {formatPrice(item.variant.price.amount, item.variant.price.currencyCode)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.totalTax.amount, order.totalTax.currencyCode)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="border-t border-border pt-4 mt-4">
                  <h4 className="font-medium text-sm mb-2">Shipping Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
