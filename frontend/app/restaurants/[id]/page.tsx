"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  AlertTriangle,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

import indianImg from "@/assets/restaurant-indian.jpg";
import americanImg from "@/assets/restaurant-american.jpg";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

interface Restaurant {
  _id: string;
  name: string;
  cuisine?: string;
  rating?: number;
  deliveryTime?: string;
  country: "INDIA" | "AMERICA";
  description?: string;
}

const RestaurantDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;
      try {
        const data = await api(`/api/restaurants/${id}/menu`);
        setRestaurant(data.restaurant);
        setMenu(data.menu);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
        toast.error("Unable to load restaurant details.");
        router.push("/restaurants");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id, router]);

  const addToCart = (itemId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success("Added to cart");
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId]--;
      else delete updated[itemId];
      return updated;
    });
    toast.success("Removed from cart");
  };

  const getTotalItems = () =>
    Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <UtensilsCrossed className="h-8 w-8 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground text-lg">
            Loading restaurant details...
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Restaurant not found.</p>
      </div>
    );
  }

  const imageSrc = restaurant.country === "AMERICA" ? americanImg : indianImg;

  const categories = [...new Set(menu.map((item) => item.category))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar cartItemsCount={getTotalItems()} />

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={imageSrc}
          alt={restaurant.name}
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/50 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="max-w-[1440px] mx-auto px-6 -mt-24 relative z-10 pb-16">
        {/* Restaurant Info */}
        <Card className="p-6 shadow-hover border border-border bg-card/90 backdrop-blur-md mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-muted-foreground mb-3">
                {restaurant.description ?? "Authentic dining experience"}
              </p>
              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{restaurant.rating?.toFixed(1) ?? "4.5"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime ?? "30–40 min"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.country}</span>
                </div>
              </div>
            </div>
            <Badge className="text-md px-4 py-2 capitalize">
              {restaurant.description ?? "Multi Cuisine"}
            </Badge>
          </div>
        </Card>

        {/* Menu Items */}
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-5 text-primary border-l-4 border-primary pl-3">
              {category}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {menu
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card
                    key={item._id}
                    className={`border border-border transition-all duration-300 ${
                      item.isAvailable
                        ? "hover:shadow-lg hover:-translate-y-1"
                        : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-primary font-medium text-sm">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <Badge className="capitalize">
                          {item.category}
                        </Badge>
                      </div>

                      {item.isAvailable ? (
                        <p className="text-green-600 text-sm font-medium mb-3">
                          Available
                        </p>
                      ) : (
                        <p className="text-red-600 text-sm font-medium mb-3 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1 text-destructive" />
                          Unavailable
                        </p>
                      )}

                      {item.isAvailable ? (
                        cartItems[item._id] ? (
                          <div className="flex items-center gap-3">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => removeFromCart(item._id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-8 text-center">
                              {cartItems[item._id]}
                            </span>
                            <Button
                              size="icon"
                              variant="default"
                              onClick={() => addToCart(item._id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full mt-1"
                            onClick={() => addToCart(item._id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        )
                      ) : (
                        <Button
                          className="w-full mt-1"
                          disabled
                          variant="outline"
                        >
                          Unavailable
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}

        {/* Floating Cart Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Link href="/cart">
              <Button
                variant="hero"
                size="lg"
                className="shadow-hover px-8 text-lg font-semibold"
              >
                View Cart ({getTotalItems()} items)
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
