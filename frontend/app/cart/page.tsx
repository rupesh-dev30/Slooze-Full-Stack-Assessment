"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem {
  menuItemId: MenuItem;
  quantity: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  country: "INDIA" | "AMERICA";
}

const Cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  // 🧠 Fetch user cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api("/api/cart");
        setCart(res.cart);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalAmount =
    cart?.items.reduce(
      (sum, item) => sum + item.menuItemId.price * item.quantity,
      0
    ) ?? 0;

  const handleUpdateQuantity = async (menuItemId: string, quantity: number) => {
    try {
      setUpdating(true);
      if (quantity === 0) {
        await api(`/api/cart/${menuItemId}`, { method: "DELETE" });
        setCart((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.filter(
                  (item) => item.menuItemId._id !== menuItemId
                ),
              }
            : null
        );
        toast.success("Item removed from cart");
      } else {
        await api("/api/cart", {
          method: "PUT",
          body: JSON.stringify({ menuItemId, quantity }),
        });
        setCart((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((item) =>
                  item.menuItemId._id === menuItemId
                    ? { ...item, quantity }
                    : item
                ),
              }
            : null
        );
        toast.success("Cart updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cart");
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      await api("/api/cart", { method: "DELETE" });
      setCart(null);
      toast.success("Cart cleared");
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear cart");
    }
  };

  const handleProceedToCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar cartItemsCount={0} />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Explore restaurants and add some items to your cart!
          </p>
          <Link href="/restaurants">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        cartItemsCount={cart.items.reduce((sum, i) => sum + i.quantity, 0)}
      />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearCart}
            disabled={updating}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-6">
          {cart.items.map((item) => (
            <Card
              key={item.menuItemId._id}
              className="border border-border hover:shadow-lg transition-all"
            >
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">
                    {item.menuItemId.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.menuItemId.category}
                  </p>
                  <p className="text-primary font-medium">
                    ${item.menuItemId.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={updating}
                    onClick={() =>
                      handleUpdateQuantity(
                        item.menuItemId._id,
                        item.quantity - 1
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="default"
                    disabled={updating}
                    onClick={() =>
                      handleUpdateQuantity(
                        item.menuItemId._id,
                        item.quantity + 1
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="mt-10 p-6 border border-border shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-lg">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-muted-foreground">Country</span>
            <Badge>{cart.country}</Badge>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={updating}
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout (${totalAmount.toFixed(2)})
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
