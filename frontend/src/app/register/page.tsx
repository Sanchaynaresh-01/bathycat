"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register as registerApi, login, getMe } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, LogOut, ShieldCheck, ArrowRight, User as UserIcon } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setToken, setUser, logout } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Register
      await registerApi({ email, password, full_name: fullName });
      
      // 2. Login immediately
      const loginData = await login(email, password);
      setToken(loginData.access_token);
      
      // 3. Get User Profile
      const userProfile = await getMe();
      setUser(userProfile);
      
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error("Registration failed", { 
        description: error.response?.data?.detail || "Please try again with a different email." 
      });
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, show current session status
  if (user) {
    return (
      <div className="container mx-auto py-24 flex justify-center items-center px-4">
        <Card className="w-full max-w-md border-primary/30 shadow-xl animate-in zoom-in-95 duration-200">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Already Signed In</CardTitle>
            <CardDescription>
              You are currently signed in as <strong className="text-foreground">{user.full_name}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border bg-muted/40 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Account:</span>
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-primary" />
                  {user.full_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Role:</span>
                <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/40 bg-primary/5">
                  {user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2.5">
            <Button 
              className="w-full gap-2 font-semibold shadow-sm"
              onClick={() => {
                if (user.role === "Admin") router.push("/admin/dashboard");
                else if (user.role === "Dealer") router.push("/dealer/dashboard");
                else router.push("/dashboard");
              }}
            >
              Go to {user.role === "Admin" ? "Admin Panel" : user.role === "Dealer" ? "Dealer Panel" : "Customer Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-muted-foreground hover:text-destructive gap-1.5 text-xs"
              onClick={() => {
                logout();
                toast.success("Signed out. You can now register a new account.");
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out to Register New Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your details below to create your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input 
                required 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="name@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
