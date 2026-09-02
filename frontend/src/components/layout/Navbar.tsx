"use client";

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">BATHYCAT</span>
        </Link>
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          {user?.role !== "Admin" && user?.role !== "Dealer" && (
            <>
              <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
              <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About Us</Link>
              <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">Products</Link>
              <Link href="/configurator" className="transition-colors hover:text-foreground/80 text-foreground/60">Configurator</Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === "Customer" ? (
                <Link href="/dashboard" className={buttonVariants({ variant: "ghost", className: "hidden md:flex" })}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Dashboard({user.full_name})
                </Link>
              ) : (
                <div className="text-sm font-medium hidden md:flex items-center text-foreground/80 cursor-default">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {user.full_name}
                </div>
              )}
              {user.role === "Admin" && (
                <Link href="/admin/dashboard" className={buttonVariants({ variant: "ghost" })}>
                  Admin Panel
                </Link>
              )}
              {user.role === "Dealer" && (
                <Link href="/dealer/dashboard" className={buttonVariants({ variant: "ghost" })}>
                  Dealer Panel
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login" className={buttonVariants({ variant: "outline" })}>
              Login
            </Link>
          )}
          {user?.role !== "Admin" && user?.role !== "Dealer" && (
            <Link href="/configurator" className={buttonVariants()}>
              Build Yours
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
