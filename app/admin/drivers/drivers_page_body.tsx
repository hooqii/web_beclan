"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Phone, Truck, Mail } from "lucide-react"
import Driver, { driverFromJson } from "./driver"
import { BASE_URL } from "@/lib/constants"
import { getRequest } from "@/lib/utils"
import { getToken } from "@/app/_actions/auth"

interface NewDriver {
  nama: string
  email: string
  noHp: string
  nomorPlat: string
  password?: string
}

interface DriversBodyPageProps {
  drivers: Driver[]
}
export default function DriversBodyPage({ drivers: defaultDrivers }: DriversBodyPageProps) {
  const [drivers, setDrivers] = useState<Driver[]>(defaultDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [formData, setFormData] = useState<NewDriver>({
    nama: "",
    email: "",
    noHp: "",
    nomorPlat: "",
    password: "",
  })

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.noHp.includes(searchTerm) ||
      driver.nomorPlat.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = async () => {
    const { nama, email, noHp, nomorPlat, password } = formData
    if (!nama || !email || !noHp || !nomorPlat || !password) return

    const token = await getToken()
    const response = await fetch(`${BASE_URL}/driver/add`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    if (response.status === 201) refreshDrivers()
    clearForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver)
    setFormData(driver)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    const { nama, email, noHp, nomorPlat, password } = formData
    const { id } = editingDriver!
    if (!nama || !email || !noHp || !nomorPlat) return

    const data = { ...formData }
    if (!password) delete data.password
    const token = await getToken()
    const response = await fetch(`${BASE_URL}/driver/edit/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if (response.status === 200) refreshDrivers()
    clearForm()
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus driver ini?")) {
      const token = await getToken()
      const response = await fetch(`${BASE_URL}/driver/remove/${id}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`}
      })
      if (response.status === 200) refreshDrivers()
    }
  }

  const refreshDrivers = async () => {
    const newDrivers = await fetchDrivers()
    setDrivers(newDrivers)
  }

  const clearForm = () => {
    setFormData({ nama: "", email: "", noHp: "", nomorPlat: "", password: "" })
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
              <CardTitle>Daftar Drivers</CardTitle>
              <CardDescription>Kelola semua driver penjemputan sampah</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, telepon, atau nomor kendaraan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-80"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={handleAddOpenChange}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Driver
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Driver Baru</DialogTitle>
                    <DialogDescription>Tambahkan driver baru ke dalam sistem</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        value={formData.noHp}
                        onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Masukkan email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicle">Nomor Kendaraan</Label>
                      <Input
                        id="vehicle"
                        value={formData.nomorPlat}
                        onChange={(e) => setFormData({ ...formData, nomorPlat: e.target.value })}
                        placeholder="Masukkan nomor kendaraan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Masukkan password"
                        type="password"
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
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Kendaraan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.nama}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {driver.noHp}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {driver.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      {driver.nomorPlat}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(driver.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Ubah informasi driver</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Nomor Telepon</Label>
              <Input
                id="edit-phone"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-vehicle">Nomor Kendaraan</Label>
              <Input
                id="edit-vehicle"
                value={formData.nomorPlat}
                onChange={(e) => setFormData({ ...formData, nomorPlat: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                value={formData.password}
                placeholder="Masukkan password baru"
                type="password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

async function fetchDrivers() {
  const endpoint = `${BASE_URL}/driver`
  const response = await getRequest<[]>(endpoint)
  const drivers = response.data.map(driverFromJson)
  return drivers
}