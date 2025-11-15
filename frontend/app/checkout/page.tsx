"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  restaurantId: string;
}
interface CartItem {
  menuItemId: MenuItem;
  quantity: number;
}
interface Cart {
  items: CartItem[];
  country: string;
}

const CheckoutPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [instructions, setInstructions] = useState("");
  const router = useRouter();

  useEffect(() => {
    api("/api/cart")
      .then((res) => setCart(res.cart))
      .catch(() => toast.error("Failed to load cart"))
      .finally(() => setLoading(false));
  }, []);

  const total = cart?.items.reduce(
    (sum, i) => sum + i.menuItemId.price * i.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      const body = {
        restaurantId: cart.items[0].menuItemId.restaurantId,
        items: cart.items.map((i) => ({
          menuItemId: i.menuItemId._id,
          quantity: i.quantity,
        })),
        paymentType: paymentMethod === "wallet" ? "UPI" : "CARD",
        notes: instructions,
      };

      const res = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify(body),
      });

      await api("/api/cart", { method: "DELETE" });
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?orderId=${res.order._id}`);
    } catch {
      toast.error("Failed to place order");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading your checkout...
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Navbar cartItemsCount={0} />
        <p>Your cart is empty.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cart.items.length} />

      <div className="max-w-[1440px] mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Payment Method</h3>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border-border">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">
                            Pay securely using your card
                          </p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border-border">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label
                        htmlFor="wallet"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Digital Wallet / UPI</p>
                          <p className="text-sm text-muted-foreground">
                            Pay via UPI, Paytm, or other wallet
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  Delivery Instructions
                </h3>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-3 border rounded-lg min-h-[100px] bg-background resize-none border-border"
                  placeholder="Add any special instructions for delivery..."
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span>{cart.items.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total?.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>$2.99</span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ${(total! + 2.99).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant="hero"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
