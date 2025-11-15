"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import { Mail, User, Globe, Shield, Calendar } from "lucide-react";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  country: "INDIA" | "AMERICA";
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api("/api/auth/me");
        setUser(data.user);
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Unable to fetch your profile. Please sign in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-semibold mb-3">Profile not found</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your profile.
        </p>
        <Button variant="hero" asChild>
          <a href="/auth">Go to Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={0} />

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto border border-border shadow-hover bg-card/90 backdrop-blur-sm">
          <CardHeader className="border-b border-border py-4">
            <CardTitle className="text-3xl font-bold text-center">
              My Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-linear-to-r from-primary to-accent text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Name</span>
                </div>
                <span className="font-semibold">{user.name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">Email</span>
                </div>
                <span className="font-semibold">{user.email}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Role</span>
                </div>
                <Badge
                  className={`text-sm px-3 py-1 capitalize ${
                    user.role === "ADMIN"
                      ? "bg-red-500/90"
                      : user.role === "MANAGER"
                      ? "bg-blue-500/90"
                      : "bg-green-500/90"
                  }`}
                >
                  {user.role}
                </Badge>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">Country</span>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {user.country}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Member Since</span>
                </div>
                <span className="font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="hero" asChild>
                <Link href="/restaurants">Browse Restaurants</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
