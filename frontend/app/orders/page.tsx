"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  restaurantId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  country: string;
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api("/api/orders");
        setOrders(res.orders);
      } catch {
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api(`/api/orders/${orderId}/cancel`, { method: "POST" });
      toast.success("Order cancelled successfully");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "Delivered":
        return "bg-green-500";
      case "CREATED":
      case "In Progress":
        return "bg-primary";
      case "CANCELLED":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={3} />
        <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
          <Package className="h-8 w-8 mb-2 text-muted-foreground" />
          <p>No orders found.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={3}/>

      <div className="max-w-[1440px] px-6 mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="hover:shadow-card border-border transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status === "PAID" ? "Delivered" : order.status}
                      </Badge>
                    </div>

                    <p className="font-medium mb-2">
                      {order.items.map((i) => i.name).join(", ")}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{order.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-2xl font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </span>

                    {order.status === "CREATED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/orders/${order._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
