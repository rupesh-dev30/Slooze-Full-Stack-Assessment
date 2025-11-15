/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/shared/Navbar";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PaymentMethod {
  _id: string;
  type: string;
  details: any;
}

const PaymentPage = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api("/api/payments")
      .then((res) => setMethods(res.methods))
      .catch(() => toast.error("Failed to load payment methods"))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async () => {
    try {
      const { user } = await api("/api/auth/me");

      if (user.role === "MEMBER") {
        toast.error("Members cannot complete payment directly.");
        return;
      }

      const cartRes = await api("/api/cart");
      const cart = cartRes.cart;

      if (!cart || cart.items.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      // Create the order
      const orderBody = {
        restaurantId: cart.items[0].menuItemId.restaurantId,
        items: cart.items.map((i: any) => ({
          menuItemId: i.menuItemId._id,
          quantity: i.quantity,
        })),
      };

      const { order } = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderBody),
      });

      // ✅ Admins & Managers auto-pay
      if (["ADMIN", "MANAGER"].includes(user.role)) {
        await api(`/api/orders/${order._id}/checkout`, { method: "POST" });
        toast.success("Order placed and marked as PAID");
      } else {
        toast.success("Order created successfully");
      }

      await api("/api/cart", { method: "DELETE" });
      router.push(`/checkout/success?orderId=${order._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete order");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={0} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Select Payment Method</h1>

        <div className="grid gap-4 mb-8">
          {methods.map((m) => (
            <Card
              key={m._id}
              onClick={() => setSelected(m._id)}
              className={`cursor-pointer transition-all ${
                selected === m._id
                  ? "border-primary shadow-md"
                  : "border-border hover:shadow"
              }`}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{m.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {m.details?.last4
                      ? `**** **** **** ${m.details.last4}`
                      : JSON.stringify(m.details)}
                  </p>
                </div>
                <input type="radio" checked={selected === m._id} readOnly />
              </CardContent>
            </Card>
          ))}
        </div>

        <Button className="w-full" onClick={handleConfirm}>
          Confirm & Place Order
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
