// app/admin/layout.tsx

import type React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Truck, Home, Users, Package, AlertCircle } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Menu navigasi untuk fitur utama sistem
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/admin/dashboard">
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/admin/pickups">
              <Truck className="h-5 w-5 mr-2" />
              Penjemputan
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/admin/products">
              <Package className="h-5 w-5 mr-2" />
              Produk
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/admin/users">
              <Users className="h-5 w-5 mr-2" />
              Users
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/admin/drivers">
              <AlertCircle className="h-5 w-5 mr-2" />
              Drivers
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
