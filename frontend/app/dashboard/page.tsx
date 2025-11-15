"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  DollarSign,
  BarChart3,
  Shield,
  Loader2,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface User {
  _id: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  country: "INDIA" | "AMERICA";
}

interface Order {
  _id: string;
  totalAmount: number;
  status: "CREATED" | "PAID" | "CANCELLED";
  country: string;
  createdAt: string;
}

interface DashboardStats {
  totalOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  paymentMethods: number;
}

const Dashboard = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { user } = await api("/api/auth/me");

        if (user.role !== "ADMIN" && user.role !== "MANAGER") {
          toast.error("Access denied. Dashboard is restricted.");
          router.push("/");
          return;
        }
        setUser(user);

        const ordersData = await api("/api/orders");
        const paymentsData = await api("/api/payments");

        setOrders(ordersData.orders || []);
        setPaymentsCount(paymentsData?.methods?.length || 0);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data.");
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const totalRevenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const stats: DashboardStats = {
    totalOrders,
    paidOrders,
    cancelledOrders,
    totalRevenue,
    paymentMethods: paymentsCount,
  };

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar cartItemsCount={0} />

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {user.name} 👋
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <Badge
              className={`capitalize ${isAdmin ? "bg-red-500" : "bg-blue-500"}`}
            >
              {user.role}
            </Badge>
            <Badge variant="outline">{user.country}</Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingBag className="text-primary" />}
            subtitle="All orders in your region"
          />
          <StatCard
            title="Paid Orders"
            value={stats.paidOrders}
            icon={<DollarSign className="text-green-500" />}
            subtitle="Completed transactions"
          />
          <StatCard
            title="Cancelled Orders"
            value={stats.cancelledOrders}
            icon={<Shield className="text-destructive" />}
            subtitle="Refunded or voided"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={<BarChart3 className="text-accent" />}
            subtitle="From paid orders"
          />
        </div>

        <Card className="border border-border shadow-sm mb-12">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Payment Methods</h3>
              <p className="text-muted-foreground text-sm">
                Available methods for your country
              </p>
            </div>
            <Badge className="text-lg px-4 py-2">{stats.paymentMethods}</Badge>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No recent orders found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 6).map((order) => (
                <Card
                  key={order._id}
                  className="p-5 border-border hover:shadow-md transition-all"
                >
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          order.status === "PAID"
                            ? "text-green-600"
                            : order.status === "CANCELLED"
                            ? "text-destructive"
                            : "text-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm mb-1">
                      Amount:{" "}
                      <span className="font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
