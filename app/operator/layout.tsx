// app/operator/layout.tsx

import type React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Calendar, Package, CheckCircle } from "lucide-react";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Menu Operator</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Akses cepat ke fitur utama
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/operator/dashboard">
              <Users className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/operator/schedules">
              <Calendar className="h-5 w-5 mr-2" />
              Kelola Jadwal
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/operator/waste_input">
              <Package className="h-5 w-5 mr-2" />
              Input Sampah
            </Link>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        
        {children}
      </div>
    </div>
  );
}
