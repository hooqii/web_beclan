import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Users,
  Home,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { getToken } from "@/app/_actions/auth";
import DashboardCard from "./dashboard_card";
import StatusBadge from "../_components/status_badge";
import LogoutButton from "./logout_button";
import { BASE_URL } from "@/lib/constants";
import DashboardProduk from "./dashboard_produk";
import { jsonToDashboardPenjemputan } from "./dashboard_penjemputan";
import Image from "next/image";
import { fetchFromServer, formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const { totalPenjemputan, produk, recentPenjemputan } = await fetchDashboardData()

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
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <DashboardCard
            title="Total Penjemputan"
            icon={<Truck className="h-4 w-4 text-muted-foreground" />}
            value={totalPenjemputan}
            showKg={false}
          />
          {produk.map((item) => (
            <DashboardCard
              key={item.id}
              title={item.nama}
              icon={(
                <Image
                  src={item.icon}
                  alt={item.nama}
                  width={20}
                  height={20}
                />
              )}
              value={item.total}
            />
          ))}
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
                {recentPenjemputan.map((pickup) => (
                  <div
                    key={pickup.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{pickup.user.nama}</h4>
                        <StatusBadge status={pickup.status} />
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {pickup.user.alamat}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        Driver: {pickup.driver.nama}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {formatCurrency(pickup.harga)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(pickup.jadwal)}
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
                {produk.map((item) => {
                  const quantity = item.total;
                  const revenue = quantity * item.harga;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          <Image
                            src={item.icon}
                            alt={item.nama}
                            width={30}
                            height={30}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.nama}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.harga)}/kg
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {quantity} kg
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
      </div>
    </div>
  );
}

interface DashboardDataResponse {
  totalPenjemputan: number
  produk: DashboardProduk[]
  recentPenjemputan: []
}

async function fetchDashboardData() {
  const endpoint = `${BASE_URL}/dashboard/dashboard_admin`
  const { data } = await fetchFromServer<DashboardDataResponse>(endpoint)
  const { totalPenjemputan, produk } = data
  const recentPenjemputan = data.recentPenjemputan.map(jsonToDashboardPenjemputan)
  
  return { totalPenjemputan, produk, recentPenjemputan }
}