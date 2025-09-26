"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, MapPin, Users } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Penjemputan from "./penjemputan"
import StatusBadge from "../_components/status_badge"

interface PickupPageBodyProps {
  pickups: Penjemputan[]
}
export default function PickupPageBody({ pickups }: PickupPageBodyProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPickup, setSelectedPickup] = useState<Penjemputan | null>(null)

  const filteredPickups = pickups.filter((pickup) => {
    return pickup.user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.driver.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.user.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  })
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Penjemputan Sampah</CardTitle>
              <CardDescription>Daftar semua penjemputan sampah beserta produknya</CardDescription>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>ID</TableHead> */}
                <TableHead>Customer</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPickups.map((pickup) => (
                <TableRow key={pickup.id}>
                  {/* <TableCell className="font-medium">#{pickup.id}</TableCell> */}
                  <TableCell>
                    <div>
                      <div className="font-medium">{pickup.user.nama}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {pickup.user.alamat.substring(0, 30)}{pickup.user.alamat.length > 30 ? "..." : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      {pickup.driver.nama}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(pickup.jadwal)}</TableCell>
                  <TableCell>
                    <StatusBadge status={pickup.status} />
                  </TableCell>
                  <TableCell className="font-semibold text-primary">{formatCurrency(pickup.harga)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPickup(pickup)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detail Penjemputan <br /> #{selectedPickup?.id}</DialogTitle>
                          <DialogDescription>Informasi lengkap penjemputan sampah</DialogDescription>
                        </DialogHeader>
                        {selectedPickup && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Informasi Customer</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <strong>Nama:</strong> {selectedPickup.user.nama}
                                  </p>
                                  <p>
                                    <strong>Alamat:</strong> {selectedPickup.user.alamat}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Informasi Driver</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <strong>Nama:</strong> {selectedPickup.driver.nama}
                                  </p>
                                  <p>
                                    <strong>Status:</strong> <StatusBadge status={selectedPickup.status} />
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Produk Sampah</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Produk</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedPickup.sampah.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.produk.nama}</TableCell>
                                      <TableCell>{item.berat} kg</TableCell>
                                      <TableCell>{formatCurrency(item.produk.harga)}</TableCell>
                                      <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Total:</span>
                                <span className="text-xl font-bold text-primary">
                                  {formatCurrency(selectedPickup.harga)}
                                </span>
                              </div>
                            </div>

                            <div className="text-sm">
                              <strong>Tanggal Dijadwalkan:</strong> {formatDate(selectedPickup.jadwal)}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
