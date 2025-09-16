"use client";

import { useState } from "react";
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
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Users,
  Truck,
  Package,
} from "lucide-react";
import {
  getTodaySchedules,
  dummySchedules,
  type Schedule,
} from "@/lib/dummy-data";
import Link from "next/link";

export default function OperatorDashboard() {
  const [todaySchedules] = useState<Schedule[]>(getTodaySchedules());
  const [allSchedules] = useState<Schedule[]>(dummySchedules);

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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const completedToday = todaySchedules.filter(
    (s) => s.status === "completed"
  ).length;
  const inProgressToday = todaySchedules.filter(
    (s) => s.status === "in-progress"
  ).length;
  const scheduledToday = todaySchedules.filter(
    (s) => s.status === "scheduled"
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
            <Button variant="outline" asChild>
              <Link href="/">Logout</Link>
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
                Jadwal Hari Ini
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {todaySchedules.length}
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
              <CardTitle className="text-sm font-medium">Berlangsung</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressToday}
              </div>
              <p className="text-xs text-muted-foreground">
                Sedang berlangsung
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
              <p className="text-xs text-muted-foreground">Menunggu eksekusi</p>
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
                {todaySchedules.length > 0 ? (
                  todaySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">
                            {schedule.customerName}
                          </h4>
                          {getStatusBadge(schedule.status)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {schedule.customerAddress}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Truck className="h-3 w-3 mr-1" />
                          Driver: {schedule.driverName}
                        </div>
                        {schedule.notes && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Package className="h-3 w-3 mr-1" />
                            {schedule.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          {schedule.timeSlot}
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
                {allSchedules.slice(0, 5).map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{schedule.customerName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {schedule.driverName} • {schedule.timeSlot}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(schedule.status)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {schedule.scheduledDate}
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
