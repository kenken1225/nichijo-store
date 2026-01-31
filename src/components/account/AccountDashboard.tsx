"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Package, MapPin, User, ChevronRight, Loader2 } from "lucide-react";
import { SubmitButton } from "./SubmitButton";
import { formatDate, formatPrice } from "@/lib/shopify";
import { CustomerOrder } from "@/lib/shopify/customer";

export function AccountDashboard() {
  const router = useRouter();
  const { customer, isLoading, logout } = useAuth();
  const [recentOrders, setRecentOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/account/orders");
        if (res.ok) {
          const data = await res.json();
          setRecentOrders(data.orders?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center pb-6 border-b border-border">
        <h2 className="text-xl font-semibold">Welcome back, {customer?.firstName || "there"}!</h2>
        <p className="text-muted-foreground text-sm mt-1">{customer?.email}</p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="p-3 rounded-full bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Orders</div>
            <div className="text-sm text-muted-foreground">View history</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>

        <Link
          href="/account/addresses"
          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="p-3 rounded-full bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Addresses</div>
            <div className="text-sm text-muted-foreground">Manage</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>

        <Link
          href="/account/profile"
          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="p-3 rounded-full bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Profile</div>
            <div className="text-sm text-muted-foreground">Edit info</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        {ordersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="font-medium">{order.name}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(order.processedAt)}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {order.fulfillmentStatus?.toLowerCase().replace("_", " ") || "Processing"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No orders yet</p>
            <Link href="/collections/all" className="text-sm text-primary hover:underline mt-2 inline-block">
              Start shopping
            </Link>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-border ">
        <SubmitButton
          onClick={handleLogout}
          loading={loggingOut}
          className="bg-transparent border border-border hover:bg-muted/50"
        >
          Log Out
        </SubmitButton>
      </div>
    </div>
  );
}
