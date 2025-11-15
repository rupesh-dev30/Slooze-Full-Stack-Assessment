"use client";

import {
  LogOut,
  Menu,
  ShoppingCart,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface NavbarProps {
  cartItemsCount?: number;
}

interface User {
  _id: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  country: "INDIA" | "AMERICA";
}

const Navbar = ({ cartItemsCount = 0 }: NavbarProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<User["role"] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api("/api/auth/me");
        if (res?.user) {
          setIsAuthenticated(true);
          setUserRole(res.user.role);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      setIsAuthenticated(false);
      setUserRole(null);
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2.5 rounded-lg">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-primary text-xl font-bold">FoodHub</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Bringing food lovers together
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/restaurants">
                <Button
                  variant={isActive("/restaurants") ? "default" : "ghost"}
                  className={`px-3 py-1 text-sm transition-colors ${
                    isActive("/restaurants")
                      ? "bg-primary text-white"
                      : ""
                  }`}
                >
                  Restaurants
                </Button>
              </Link>

              <Link href="/orders">
                <Button
                  variant={isActive("/orders") ? "default" : "ghost"}
                  className={`px-3 py-1 text-sm transition-colors ${
                    isActive("/orders")
                      ? "bg-primary text-white"
                      : ""
                  }`}
                >
                  Orders
                </Button>
              </Link>

              {(userRole === "ADMIN" || userRole === "MANAGER") && (
                <Link href="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    className={`px-3 py-1 text-sm transition-colors ${
                      isActive("/dashboard")
                        ? "bg-primary text-white"
                        : ""
                    }`}
                  >
                    Dashboard
                  </Button>
                </Link>
              )}

              <Link href="/cart" className="relative">
                <Button
                  variant={isActive("/cart") ? "default" : "ghost"}
                  size="icon"
                  className={`p-2 transition-colors ${
                    isActive("/cart")
                      ? "bg-primary text-white"
                      : ""
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-white text-[10px]">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/profile">
                <Button
                  variant={isActive("/profile") ? "default" : "ghost"}
                  size="icon"
                  className={`p-2 transition-colors ${
                    isActive("/profile")
                      ? "bg-primary text-white"
                      : ""
                  }`}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="p-2 text-black hover:text-white hover:bg-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant={isActive("/sign-in") ? "default" : "outline"}
                  className={`px-3 py-1 text-sm border-border ${
                    isActive("/sign-in") ? "bg-primary text-white" : ""
                  }`}
                >
                  Login
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button
                  className={`px-3 py-1 text-sm ${
                    isActive("/sign-up") ? "bg-primary text-white" : ""
                  }`}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border bg-background ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-3 py-2 space-y-1">
          {isAuthenticated ? (
            <>
              <Link href="/restaurants" className="w-full">
                <Button
                  variant={isActive("/restaurants") ? "default" : "ghost"}
                  className={`w-full justify-start text-sm py-2 ${
                    isActive("/restaurants")
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  Restaurants
                </Button>
              </Link>

              <Link href="/orders" className="w-full">
                <Button
                  variant={isActive("/orders") ? "default" : "ghost"}
                  className={`w-full justify-start text-sm py-2 ${
                    isActive("/orders")
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  Orders
                </Button>
              </Link>

              {(userRole === "ADMIN" || userRole === "MANAGER") && (
                <Link href="/dashboard" className="w-full">
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    className={`w-full justify-start text-sm py-2 ${
                      isActive("/dashboard")
                        ? "bg-primary text-white"
                        : "hover:bg-muted"
                    }`}
                  >
                    Dashboard
                  </Button>
                </Link>
              )}

              <Link href="/cart" className="w-full relative">
                <Button
                  variant={isActive("/cart") ? "default" : "ghost"}
                  className={`w-full justify-start text-sm py-2 ${
                    isActive("/cart")
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Cart
                  {cartItemsCount > 0 && (
                    <Badge className="ml-2 bg-primary text-white text-[10px] h-4 w-4 flex items-center justify-center p-0">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/profile" className="w-full">
                <Button
                  variant={isActive("/profile") ? "default" : "ghost"}
                  className={`w-full justify-start text-sm py-2 ${
                    isActive("/profile")
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <User className="h-4 w-4 mr-2" /> Profile
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-red-500 hover:bg-destructive hover:text-white py-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="w-full">
                <Button
                  variant={isActive("/sign-in") ? "default" : "outline"}
                  className={`w-full text-sm py-2 ${
                    isActive("/sign-in") ? "bg-primary text-white" : ""
                  }`}
                >
                  Login
                </Button>
              </Link>

              <Link href="/sign-up" className="w-full">
                <Button
                  className={`w-full text-sm py-2 ${
                    isActive("/sign-up") ? "bg-primary text-white" : ""
                  }`}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
