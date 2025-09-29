"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Search, MapPin, Truck } from "lucide-react"
import Jadwal, { jadwalFromJson } from "../_types/jadwal"
import { formatDate, formatHours, getRequest } from "@/lib/utils"
import StatusBadge from "@/app/admin/_components/status_badge"
import { format } from "date-fns"
import User from "@/app/_types/user"
import Driver from "@/app/_types/driver"
import { getToken } from "@/app/_actions/auth"
import { BASE_URL } from "@/lib/constants"

interface NewJadwal {
  idUser: string
  idDriver: string
  jadwal: string
}
interface SchedulesBodyPageProps {
  schedules: Jadwal[]
  users: User[]
  drivers: Driver[]
}
export default function SchedulesBodyPage({ schedules: defaultSchedules, users, drivers }: SchedulesBodyPageProps) {
  const [schedules, setSchedules] = useState<Jadwal[]>(defaultSchedules)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Jadwal | null>(null)
  const [formData, setFormData] = useState<NewJadwal>({
    idUser: "",
    idDriver: "",
    jadwal: "",
  })

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.driver.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.user.alamat.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDateValue = (tanggal: Date) => {
    const date = format(tanggal, "yyyy-MM-dd")
    const hours = format(tanggal, "HH:mm")
    return `${date}T${hours}`
  }

  const handleAdd = async () => {
    const { idDriver, idUser, jadwal } = formData
    if (!idDriver || !idUser || !jadwal) return

    const token = await getToken()
    const response = await fetch(`${BASE_URL}/jadwal_jemput/add`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    if (response.status === 201) refreshSchedules()
    handleAddOpenChange(false)
  }

  const handleEdit = (schedule: Jadwal) => {
    setEditingSchedule(schedule)
    setFormData({
      idUser: schedule.user.id,
      idDriver: schedule.driver.id,
      jadwal: formatDateValue(schedule.jadwal),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    const { idDriver, idUser, jadwal } = formData
    const { id } = editingSchedule!
    if (!idDriver || !idUser || !jadwal) return

    const token = await getToken()
    const response = await fetch(`${BASE_URL}/jadwal_jemput/edit/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    if (response.status === 200) refreshSchedules()
    handleEditOpenChange(false)
  }

  const refreshSchedules = async () => {
    const newSchedules = await fetchSchedules()
    setSchedules(newSchedules)
  }

  const clearForm = () => {
    setFormData({ idUser: "", idDriver: "", jadwal: "" })
  }
  
  const handleAddOpenChange = (open: boolean) => {
    if (!open) clearForm()
    setIsAddDialogOpen(open)
  }

  const handleEditOpenChange = (open: boolean) => {
    if (!open) clearForm()
    setIsEditDialogOpen(open)
  }

  return (
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
              <Dialog open={isAddDialogOpen} onOpenChange={handleAddOpenChange}>
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
                        value={formData.idDriver}
                        onValueChange={(value) => setFormData({ ...formData, idDriver: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers
                            .map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.nama} - {driver.nomorPlat}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="customer">Customer</Label>
                      <Select
                        value={formData.idUser}
                        onValueChange={(value) => setFormData({ ...formData, idUser: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.nama} - {user.alamat.substring(0, 30)}{user.alamat.length > 30 && "..."}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Tanggal</Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        value={formData.jadwal}
                        onChange={(e) => setFormData({ ...formData, jadwal: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => handleAddOpenChange(false)}>
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
                <TableHead>#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule, index) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{schedule.user.nama}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {schedule.user.alamat.substring(0, 30)}{schedule.user.alamat.length > 30 && "..."}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      {schedule.driver.nama}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(schedule.jadwal)}</TableCell>
                  <TableCell>{formatHours(schedule.jadwal)}</TableCell>
                  <TableCell><StatusBadge status={schedule.status} /></TableCell>
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
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Jadwal</DialogTitle>
            <DialogDescription>Ubah informasi jadwal penjemputan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-driver">Driver</Label>
              <Select
                value={formData.idDriver}
                onValueChange={(value) => setFormData({ ...formData, idDriver: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {drivers
                    .map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.nama} - {driver.nomorPlat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-customer">Customer</Label>
              <Select
                value={formData.idUser}
                onValueChange={(value) => setFormData({ ...formData, idUser: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nama} - {user.alamat.substring(0, 30)}{user.alamat.length > 30 && "..."}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-date">Tanggal</Label>
              <Input
                id="edit-date"
                type="datetime-local"
                value={formData.jadwal}
                onChange={(e) => setFormData({ ...formData, jadwal: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => handleEditOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

async function fetchSchedules() {
  const endpoint = `${BASE_URL}/jadwal_jemput/all`
  const response = await getRequest<[]>(endpoint)
  const schedules = response.data.map(jadwalFromJson)
  return schedules
}