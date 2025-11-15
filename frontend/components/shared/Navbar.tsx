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
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface NavbarProps {
  cartItemsCount: number;
}

const Navbar = ({ cartItemsCount }: NavbarProps) => {
  // TODO
  const isAuthenticated = true;
  const userRole = "ADMIN"; // "ADMIN" | "MANAGER" | "MEMBER"

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Brand */}
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/restaurants">
                  <Button variant="ghost" className="px-3 py-1 text-sm">
                    Restaurants
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="ghost" className="px-3 py-1 text-sm">
                    Orders
                  </Button>
                </Link>

                {(userRole === "ADMIN" || userRole === "MANAGER") && (
                  <Link href="/dashboard">
                    <Button variant="ghost" className="px-3 py-1 text-sm">
                      Dashboard
                    </Button>
                  </Link>
                )}

                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="p-2">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-white text-[10px]">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="p-2">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-black hover:text-white"
                  onClick={() => {}}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="px-3 py-1 text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="px-3 py-1 text-sm">Sign Up</Button>
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
      </div>

      {/* Mobile Dropdown */}
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
                  variant="ghost"
                  className="w-full justify-start text-sm py-2"
                >
                  Restaurants
                </Button>
              </Link>
              <Link href="/orders" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm py-2"
                >
                  Orders
                </Button>
              </Link>

              {(userRole === "ADMIN" || userRole === "MANAGER") && (
                <Link href="/dashboard" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm py-2"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}

              <Link href="/cart" className="w-full relative">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm py-2"
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
                  variant="ghost"
                  className="w-full justify-start text-sm py-2"
                >
                  <User className="h-4 w-4 mr-2" /> Profile
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-red-500 hover:text-red-600 py-2"
                onClick={() => {}}
              >
                <LogOut className="h-4 w-4 mr-2 text-3xl" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full text-sm py-2">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full text-sm py-2">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
