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
import { cn } from "@/lib/utils";

const SignUpPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("INDIA");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          country,
          role: "MEMBER",
        }),
      });

      toast.success("Account Created successfully!");
      // await refresh();

      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // await refresh();
      router.push("/restaurants");
    } catch(error) {
      console.log(error);
      
      toast.error("Failed in creating account. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-hover border border-border py-6">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary p-3 rounded-lg">
            <UtensilsCrossed className="text-white w-8 h-8" />
          </div>
        </div>

        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join FoodHub and start ordering</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="space-y-2">
            <Label>Country</Label>
            <select
              className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
              )}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="INDIA">India</option>
              <option value="AMERICA">America</option>
            </select>
          </div>

          <Button variant="hero" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-3 text-center text-sm">
          Already have an account?{" "}
          <Link href={"/sign-in"} className="text-primary hover:underline">
            Sign In
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

export default SignUpPage;
