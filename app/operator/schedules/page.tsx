"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Plus, Edit, ArrowLeft, Search, Clock, CheckCircle, MapPin, Truck } from "lucide-react"
import { dummySchedules, dummyDrivers, dummyUsers, type Schedule } from "@/lib/dummy-data"
import Link from "next/link"

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(dummySchedules)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [formData, setFormData] = useState({
    driverId: "",
    customerId: "",
    scheduledDate: "",
    timeSlot: "",
    status: "scheduled" as "scheduled" | "in-progress" | "completed",
    notes: "",
  })

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Berlangsung
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Calendar className="w-3 h-3 mr-1" />
            Terjadwal
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleAdd = () => {
    if (formData.driverId && formData.customerId && formData.scheduledDate && formData.timeSlot) {
      const driver = dummyDrivers.find((d) => d.id === formData.driverId)
      const customer = dummyUsers.find((u) => u.id === formData.customerId)

      if (driver && customer) {
        const newSchedule: Schedule = {
          id: (schedules.length + 1).toString(),
          driverId: formData.driverId,
          driverName: driver.name,
          customerId: formData.customerId,
          customerName: customer.name,
          customerAddress: customer.address,
          scheduledDate: formData.scheduledDate,
          timeSlot: formData.timeSlot,
          status: formData.status,
          notes: formData.notes,
        }
        setSchedules([...schedules, newSchedule])
        setFormData({
          driverId: "",
          customerId: "",
          scheduledDate: "",
          timeSlot: "",
          status: "scheduled",
          notes: "",
        })
        setIsAddDialogOpen(false)
      }
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      driverId: schedule.driverId,
      customerId: schedule.customerId,
      scheduledDate: schedule.scheduledDate,
      timeSlot: schedule.timeSlot,
      status: schedule.status,
      notes: schedule.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingSchedule && formData.driverId && formData.customerId && formData.scheduledDate && formData.timeSlot) {
      const driver = dummyDrivers.find((d) => d.id === formData.driverId)
      const customer = dummyUsers.find((u) => u.id === formData.customerId)

      if (driver && customer) {
        const updatedSchedules = schedules.map((schedule) =>
          schedule.id === editingSchedule.id
            ? {
                ...schedule,
                driverId: formData.driverId,
                driverName: driver.name,
                customerId: formData.customerId,
                customerName: customer.name,
                customerAddress: customer.address,
                scheduledDate: formData.scheduledDate,
                timeSlot: formData.timeSlot,
                status: formData.status,
                notes: formData.notes,
              }
            : schedule,
        )
        setSchedules(updatedSchedules)
        setFormData({
          driverId: "",
          customerId: "",
          scheduledDate: "",
          timeSlot: "",
          status: "scheduled",
          notes: "",
        })
        setEditingSchedule(null)
        setIsEditDialogOpen(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/operator/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
            <div className="bg-primary rounded-lg p-2">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Kelola Jadwal Penjemputan</h1>
              <p className="text-sm text-muted-foreground">Atur dan kelola jadwal penjemputan sampah</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Jadwal Penjemputan</CardTitle>
                <CardDescription>Daftar semua jadwal penjemputan sampah</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari customer, driver, atau alamat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-80"
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Jadwal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Jadwal Baru</DialogTitle>
                      <DialogDescription>Buat jadwal penjemputan sampah baru</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="driver">Driver</Label>
                        <Select
                          value={formData.driverId}
                          onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {dummyDrivers
                              .filter((driver) => driver.status === "active")
                              .map((driver) => (
                                <SelectItem key={driver.id} value={driver.id}>
                                  {driver.name} - {driver.vehicleNumber}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="customer">Customer</Label>
                        <Select
                          value={formData.customerId}
                          onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {dummyUsers
                              .filter((user) => user.role === "customer")
                              .map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} - {user.address.substring(0, 30)}...
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Tanggal</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Waktu</Label>
                        <Select
                          value={formData.timeSlot}
                          onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih waktu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00-10:00">08:00 - 10:00</SelectItem>
                            <SelectItem value="10:00-12:00">10:00 - 12:00</SelectItem>
                            <SelectItem value="13:00-15:00">13:00 - 15:00</SelectItem>
                            <SelectItem value="15:00-17:00">15:00 - 17:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Terjadwal</SelectItem>
                            <SelectItem value="in-progress">Berlangsung</SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Catatan</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Catatan tambahan (opsional)"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button onClick={handleAdd}>Tambah</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">#{schedule.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{schedule.customerName}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {schedule.customerAddress.substring(0, 30)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                        {schedule.driverName}
                      </div>
                    </TableCell>
                    <TableCell>{schedule.scheduledDate}</TableCell>
                    <TableCell>{schedule.timeSlot}</TableCell>
                    <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Jadwal</DialogTitle>
              <DialogDescription>Ubah informasi jadwal penjemputan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-driver">Driver</Label>
                <Select
                  value={formData.driverId}
                  onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyDrivers
                      .filter((driver) => driver.status === "active")
                      .map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name} - {driver.vehicleNumber}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-customer">Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyUsers
                      .filter((user) => user.role === "customer")
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.address.substring(0, 30)}...
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-date">Tanggal</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Waktu</Label>
                <Select
                  value={formData.timeSlot}
                  onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00-10:00">08:00 - 10:00</SelectItem>
                    <SelectItem value="10:00-12:00">10:00 - 12:00</SelectItem>
                    <SelectItem value="13:00-15:00">13:00 - 15:00</SelectItem>
                    <SelectItem value="15:00-17:00">15:00 - 17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Terjadwal</SelectItem>
                    <SelectItem value="in-progress">Berlangsung</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-notes">Catatan</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleUpdate}>Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
