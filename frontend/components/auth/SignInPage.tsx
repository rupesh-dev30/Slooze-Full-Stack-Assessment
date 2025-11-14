"use client";

import { UtensilsCrossed } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      toast.success("Signed in successfully!");
      // await refresh();

      router.push("/restaurants");
    } catch {
      toast.error("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-hover border border-border">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary p-3 rounded-lg">
            <UtensilsCrossed className="text-white w-8 h-8" />
          </div>
        </div>

        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your FoodHub account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button variant="hero" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-3 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href={"/sign-up"} className="text-primary hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href={"/"} className="text-sm text-muted-foreground">
            ← Back to home
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
