/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;
    api(`/api/orders/${orderId}`)
      .then((res) => setOrder(res.order))
      .catch(() => toast.error("Failed to load order"));
  }, [orderId]);

  if (!order)
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={0} />
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-3 text-foreground">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-6">Here’s your order summary:</p>

        <Card className="border-border shadow-md mb-8">
          <CardContent className="p-6 text-left">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Country:</strong> {order.country}</p>
            <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Button variant="hero" onClick={() => router.push("/restaurants")}>
          Continue Browsing
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
