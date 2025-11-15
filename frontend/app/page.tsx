"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/shared/Navbar";
import { Clock, Shield, Truck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/hero-food.jpg";

const App = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar cartItemsCount={3} />

      <section className="relative flex items-center justify-center overflow-hidden h-[650px] sm:h-[700px]">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="FoodHub Hero"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/80 to-black/70" />
        </div>

        <div className="relative z-10 text-center text-white px-6 sm:px-8 max-w-[900px] mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Delicious Food, <br className="hidden sm:block" />
            <span className="text-accent">Delivered Fast</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-[700px] mx-auto">
            Order from the best restaurants in India and America — fresh, fast,
            and always delicious.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/restaurants">
              <Button
                size="lg"
                className="text-lg px-8 bg-white text-primary font-semibold hover:bg-white/90 transition"
              >
                Order Now
              </Button>
            </Link>
            <Link href="/restaurants">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-primary text-white border-none font-semibold hover:bg-white hover:text-primary transition"
              >
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Why Choose <span className="text-primary">FoodHub?</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-[650px] mx-auto">
              Experience lightning-fast delivery, secure payments, and trusted restaurants — all in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "Fast Delivery",
                description: "Get your food delivered in 30 minutes or less — guaranteed freshness every time.",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Safe and encrypted payment options for your peace of mind.",
              },
              {
                icon: Truck,
                title: "Track Orders",
                description: "Real-time tracking from kitchen to doorstep for full transparency.",
              },
              {
                icon: Star,
                title: "Top Restaurants",
                description: "We partner with only the best-rated local and international restaurants.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
              >
                <div className="bg-linear-to-r from-primary to-accent p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-md">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-primary to-accent text-white text-center">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-base md:text-lg mb-10 text-white/90 max-w-[650px] mx-auto">
            Join thousands of satisfied customers enjoying their favorite meals daily.
          </p>
          <Link href="/sign-in">
            <Button
              size="lg"
              className="text-lg px-10 py-6 bg-white text-primary font-semibold hover:bg-white/90 transition"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-foreground text-background py-8 text-center mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <p className="text-sm opacity-90">
            © {new Date().getFullYear()} <span className="font-semibold">FoodHub</span>. 
            All rights reserved. | Serving <span className="text-primary font-medium">India & America</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
