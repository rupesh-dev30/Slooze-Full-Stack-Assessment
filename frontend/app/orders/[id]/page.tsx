"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, XCircle } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  status: "CREATED" | "PAID" | "CANCELLED";
  totalAmount: number;
  country: "INDIA" | "AMERICA";
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  country: string;
}

const OrderDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api("/api/auth/me");
        setUser(userRes.user);

        const orderRes = await api(`/api/orders/${id}`);
        setOrder(orderRes.order);

        if (userRes.user) {
          try {
            const cartRes = await api("/api/cart");
            const cartItems = cartRes.cart?.items ?? [];
            const totalCount = cartItems.reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (sum: number, item: any) => sum + item.quantity,
              0
            );
            setCartCount(totalCount);
          } catch {
            setCartCount(0);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load order details");
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleUpdateStatus = async (newStatus: "PAID" | "CANCELLED") => {
    if (!order) return;
    try {
      setUpdating(true);
      const endpoint =
        newStatus === "PAID"
          ? `/api/orders/${order._id}/checkout`
          : `/api/orders/${order._id}/cancel`;

      await api(endpoint, { method: "POST" });

      setOrder({ ...order, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Order not found
      </div>
    );
  }

  const isManagerOrAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar cartItemsCount={cartCount} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Order #{order._id.slice(-6)}
              </h2>
              <Badge
                className={`${
                  order.status === "PAID"
                    ? "bg-green-500"
                    : order.status === "CANCELLED"
                    ? "bg-destructive"
                    : "bg-yellow-500"
                }`}
              >
                {order.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              Country: <span className="font-medium">{order.country}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Created:{" "}
              {new Date(order.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Updated:{" "}
              {new Date(order.updatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            <div className="h-px bg-border my-4" />

            <h3 className="text-lg font-semibold mb-3">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px bg-border my-4" />

            <div className="flex justify-between items-center text-lg font-semibold">
              <p>Total</p>
              <p className="text-primary">${order.totalAmount.toFixed(2)}</p>
            </div>

            {isManagerOrAdmin && order.status === "CREATED" && (
              <div className="flex gap-3 mt-6">
                <Button
                  variant="default"
                  onClick={() => handleUpdateStatus("PAID")}
                  disabled={updating}
                >
                  <DollarSign className="h-4 w-4 mr-1" /> Mark Paid
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus("CANCELLED")}
                  disabled={updating}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Button variant="ghost" onClick={() => router.push("/orders")}>
          ← Back to Orders
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
