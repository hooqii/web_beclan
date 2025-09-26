"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Users,
  Package,
  Home,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  getTotalPickupsThisMonth,
  getProductQuantitiesThisMonth,
  getRecentPickups,
  dummyProducts,
} from "@/lib/dummy-data";
import Link from "next/link";
import { removeToken } from "@/app/_actions/auth";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter()
  const totalPickups = getTotalPickupsThisMonth();
  const productQuantities = getProductQuantitiesThisMonth();
  const recentPickups = getRecentPickups();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Berlangsung
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Calendar className="w-3 h-3 mr-1" />
            Terjadwal
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const logout = async () => {
    await removeToken()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-lg p-2">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Sistem Manajemen Sampah
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button onClick={logout} variant="outline" asChild>
              <p className="cursor-pointer">Logout</p>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Penjemputan Bulan Ini
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalPickups}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sampah Organik
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {productQuantities["Sampah Organik"] || 0} kg
              </div>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sampah Plastik
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {productQuantities["Sampah Plastik"] || 0} kg
              </div>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sampah Kertas
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {productQuantities["Sampah Kertas"] || 0} kg
              </div>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Pickups */}
          <Card>
            <CardHeader>
              <CardTitle>5 Penjemputan Terakhir</CardTitle>
              <CardDescription>
                Aktivitas penjemputan sampah terbaru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPickups.map((pickup) => (
                  <div
                    key={pickup.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{pickup.customerName}</h4>
                        {getStatusBadge(pickup.status)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {pickup.customerAddress}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        Driver: {pickup.driverName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {formatCurrency(pickup.totalAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {pickup.scheduledDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/admin/pickups">Lihat Semua Penjemputan</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Produk Sampah</CardTitle>
              <CardDescription>
                Jumlah setiap jenis sampah bulan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyProducts.map((product) => {
                  const quantity = productQuantities[product.name] || 0;
                  const revenue = quantity * product.price;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{product.icon}</div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(product.price)}/{product.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {quantity} {product.unit}
                        </div>
                        <div className="text-sm text-primary">
                          {formatCurrency(revenue)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                  <Link href="/admin/products">Kelola Produk</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/users">Kelola User</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Menu navigasi untuk fitur utama sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent"
                asChild
              >
                <Link href="/admin/pickups">
                  <Truck className="h-6 w-6 mb-2" />
                  Penjemputan
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent"
                asChild
              >
                <Link href="/admin/products">
                  <Package className="h-6 w-6 mb-2" />
                  Produk
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent"
                asChild
              >
                <Link href="/admin/users">
                  <Users className="h-6 w-6 mb-2" />
                  Users
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent"
                asChild
              >
                <Link href="/admin/drivers">
                  <AlertCircle className="h-6 w-6 mb-2" />
                  Drivers
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
