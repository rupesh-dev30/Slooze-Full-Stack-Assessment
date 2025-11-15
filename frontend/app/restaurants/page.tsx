"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { toast } from "sonner";

import indianImg from "@/assets/restaurant-indian.jpg";
import americanImg from "@/assets/restaurant-american.jpg";
import Navbar from "@/components/shared/Navbar";

interface Restaurant {
  _id: string;
  name: string;
  country: "INDIA" | "AMERICA";
  description?: string;
  rating?: number;
  deliveryTime?: string;
  cuisine?: string;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await api("/api/restaurants", { method: "GET" });
        setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        toast.error("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={0} />

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">Restaurants</h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing restaurants near you
          </p>
        </div>

        {restaurants.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-muted-foreground text-base">
              No restaurants available right now.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => {
              const imageSrc =
                restaurant.country === "AMERICA" ? americanImg : indianImg;

              return (
                <Link
                  key={restaurant._id}
                  href={`/restaurants/${restaurant._id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={restaurant.name}
                        fill
                        className="object-cover transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {restaurant.country}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="pb-6">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {restaurant.description || "No description available."}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-primary">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium">
                            {restaurant.rating?.toFixed(1) ?? "4.5"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{restaurant.deliveryTime ?? "30–40 min"}</span>
                        </div>

                        <Badge className="capitalize">
                          {restaurant.cuisine ?? "General"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
