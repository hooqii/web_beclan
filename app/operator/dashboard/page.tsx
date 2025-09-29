import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Users,
  Truck,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/app/admin/_components/status_badge";
import { jadwalFromJson } from "../_types/jadwal";
import { BASE_URL } from "@/lib/constants";
import { formatDate, formatHours, getRequest } from "@/lib/utils";
import LogoutButton from "./logout_button";

export default async function OperatorDashboard() {
  const { recentAktivitas, jadwalHariIni } = await fetchDashboardData()

  const completedToday = jadwalHariIni.filter(
    (s) => s.status === "Selesai"
  ).length;
  const scheduledToday = jadwalHariIni.filter(
    (s) => s.status === "Terjadwal"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-lg p-2">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Operator Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Sistem Manajemen Penjemputan Sampah
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jadwal Hari Ini
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {jadwalHariIni.length}
              </div>
              <p className="text-xs text-muted-foreground">Total penjemputan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedToday}
              </div>
              <p className="text-xs text-muted-foreground">
                Penjemputan selesai
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terjadwal</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {scheduledToday}
              </div>
              <p className="text-xs text-muted-foreground">Menunggu penjemputan</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Penjemputan Hari Ini</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jadwalHariIni.length > 0 ? (
                  jadwalHariIni.map((schedule, index) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">
                            {schedule.user.nama}
                          </h4>
                          <StatusBadge status={schedule.status} />
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {schedule.user.alamat}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Truck className="h-3 w-3 mr-1" />
                          Driver: {schedule.driver.nama}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          {formatHours(schedule.jadwal)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          #{schedule.id}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada jadwal penjemputan hari ini</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <Link href="/operator/schedules">Kelola Semua Jadwal</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Riwayat penjemputan dan aktivitas sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAktivitas.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{schedule.user.nama}</h4>
                        <p className="text-sm text-muted-foreground">
                          {schedule.driver.nama} • {formatHours(schedule.jadwal)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={schedule.status} />
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(schedule.jadwal)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
      </div>
    </div>
  );
}

interface DashboardDataResponse {
  recentAktivitas: {[key: string]: any}[]
  jadwalHariIni: {[key: string]: any}[]
}

async function fetchDashboardData() {
  const endpoint = `${BASE_URL}/dashboard/dashboard_operator`
  const response  = await getRequest<DashboardDataResponse>(endpoint)
  const recentAktivitas = response.data.recentAktivitas.map(jadwalFromJson)
  const jadwalHariIni = response.data.jadwalHariIni.map(jadwalFromJson)
  return { recentAktivitas, jadwalHariIni }
}