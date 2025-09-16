"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Truck, Search, Eye, ArrowLeft, CheckCircle, Clock, Calendar, XCircle, MapPin, Users } from "lucide-react"
import { dummyPickups, type Pickup } from "@/lib/dummy-data"
import Link from "next/link"

export default function PickupsPage() {
  const [pickups] = useState<Pickup[]>(dummyPickups)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null)

  const filteredPickups = pickups.filter(
    (pickup) =>
      pickup.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()),
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
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Dibatalkan
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-lg p-2">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Daftar Penjemputan Sampah</h1>
              <p className="text-sm text-muted-foreground">Kelola semua penjemputan sampah</p>
            </div>
          </div>
        </div>
      </div>

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
                  <TableHead>ID</TableHead>
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
                    <TableCell className="font-medium">#{pickup.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pickup.customerName}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {pickup.customerAddress.substring(0, 30)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {pickup.driverName}
                      </div>
                    </TableCell>
                    <TableCell>{pickup.scheduledDate}</TableCell>
                    <TableCell>{getStatusBadge(pickup.status)}</TableCell>
                    <TableCell className="font-semibold text-primary">{formatCurrency(pickup.totalAmount)}</TableCell>
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
                            <DialogTitle>Detail Penjemputan #{selectedPickup?.id}</DialogTitle>
                            <DialogDescription>Informasi lengkap penjemputan sampah</DialogDescription>
                          </DialogHeader>
                          {selectedPickup && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Informasi Customer</h4>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>Nama:</strong> {selectedPickup.customerName}
                                    </p>
                                    <p>
                                      <strong>Alamat:</strong> {selectedPickup.customerAddress}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Informasi Driver</h4>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>Nama:</strong> {selectedPickup.driverName}
                                    </p>
                                    <p>
                                      <strong>Status:</strong> {getStatusBadge(selectedPickup.status)}
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
                                    {selectedPickup.products.map((product, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell>{product.quantity} kg</TableCell>
                                        <TableCell>{formatCurrency(product.price)}</TableCell>
                                        <TableCell>{formatCurrency(product.quantity * product.price)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold">Total:</span>
                                  <span className="text-xl font-bold text-primary">
                                    {formatCurrency(selectedPickup.totalAmount)}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>Tanggal Dijadwalkan:</strong> {selectedPickup.scheduledDate}
                                </div>
                                <div>
                                  <strong>Tanggal Dibuat:</strong> {selectedPickup.createdAt}
                                </div>
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
    </div>
  )
}
