"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Package, ShieldAlert } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!token) {
        router.push("/login");
      } else if (user && user.role !== "Admin") {
        logout();
        router.push("/login");
      }
    }
  }, [token, user, mounted, router, logout]);

  if (!mounted || !token || (user && user.role !== "Admin")) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-lg text-primary">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
            <LayoutDashboard className="mr-3 h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
            <Package className="mr-3 h-4 w-4" />
            Products
          </Link>
          <Link href="/admin/components" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
            <Package className="mr-3 h-4 w-4" />
            Components
          </Link>
          <Link href="/admin/inventory" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
            <ShieldAlert className="mr-3 h-4 w-4" />
            Inventory & Constraints
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
