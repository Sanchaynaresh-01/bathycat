"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User as UserIcon, Shield, Briefcase, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">BATHYCAT</span>
        </Link>
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground text-foreground/70">Home</Link>
          <Link href="/about" className="transition-colors hover:text-foreground text-foreground/70">About Us</Link>
          <Link href="/products" className="transition-colors hover:text-foreground text-foreground/70">Products</Link>
          <Link href="/configurator" className="transition-colors hover:text-foreground text-foreground/70">Configurator</Link>
        </div>
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {user.role === "Customer" && (
                <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden sm:flex items-center gap-1.5" })}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              {user.role === "Admin" && (
                <Link href="/admin/dashboard" className={buttonVariants({ variant: "secondary", size: "sm", className: "flex items-center gap-1.5" })}>
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>Admin Panel</span>
                </Link>
              )}
              {user.role === "Dealer" && (
                <Link href="/dealer/dashboard" className={buttonVariants({ variant: "secondary", size: "sm", className: "flex items-center gap-1.5" })}>
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  <span>Dealer Panel</span>
                </Link>
              )}
              
              <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground hidden lg:flex items-center gap-1.5 border border-border/50">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                <span>{user.full_name}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive">
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Login
            </Link>
          )}
          <Link href="/configurator" className={buttonVariants({ size: "sm" })}>
            Build Yours
          </Link>
        </div>
      </div>
    </nav>
  );
}
