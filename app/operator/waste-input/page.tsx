"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Trash2, ArrowLeft, Save, Calculator } from "lucide-react"
import { dummyProducts, dummyUsers } from "@/lib/dummy-data"
import Link from "next/link"

interface WasteItem {
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export default function WasteInputPage() {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([])
  const [notes, setNotes] = useState("")
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: "",
  })

  const customers = dummyUsers.filter((user) => user.role === "customer")
  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const addWasteItem = () => {
    if (newItem.productId && newItem.quantity) {
      const product = dummyProducts.find((p) => p.id === newItem.productId)
      if (product) {
        const quantity = Number.parseFloat(newItem.quantity)
        const subtotal = quantity * product.price

        const wasteItem: WasteItem = {
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
          subtotal,
        }

        setWasteItems([...wasteItems, wasteItem])
        setNewItem({ productId: "", quantity: "" })
      }
    }
  }

  const removeWasteItem = (index: number) => {
    setWasteItems(wasteItems.filter((_, i) => i !== index))
  }

  const getTotalAmount = () => {
    return wasteItems.reduce((total, item) => total + item.subtotal, 0)
  }

  const handleSave = () => {
    if (selectedCustomer && wasteItems.length > 0) {
      // Here you would normally save to backend
      alert("Data sampah berhasil disimpan!")

      // Reset form
      setSelectedCustomer("")
      setWasteItems([])
      setNotes("")
      setNewItem({ productId: "", quantity: "" })
    } else {
      alert("Mohon pilih customer dan tambahkan minimal satu item sampah!")
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
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Input Sampah ke Kantor</h1>
              <p className="text-sm text-muted-foreground">Catat sampah yang diantar ke kantor sampah</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Penyerahan</CardTitle>
              <CardDescription>Pilih customer dan input jenis sampah yang diserahkan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.address.substring(0, 30)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCustomerData && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedCustomerData.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedCustomerData.address}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomerData.phone}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Tambah Item Sampah</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="product">Jenis Sampah</Label>
                    <Select
                      value={newItem.productId}
                      onValueChange={(value) => setNewItem({ ...newItem, productId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis sampah" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.icon} {product.name} - {formatCurrency(product.price)}/{product.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Jumlah (kg)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      placeholder="Masukkan jumlah dalam kg"
                    />
                  </div>
                  <Button onClick={addWasteItem} className="w-full" disabled={!newItem.productId || !newItem.quantity}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Item
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Sampah</CardTitle>
              <CardDescription>Item sampah yang akan diserahkan ke kantor</CardDescription>
            </CardHeader>
            <CardContent>
              {wasteItems.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wasteItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell>{item.quantity} kg</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell className="font-semibold text-primary">{formatCurrency(item.subtotal)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => removeWasteItem(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(getTotalAmount())}</span>
                    </div>
                    <Button
                      onClick={handleSave}
                      className="w-full"
                      disabled={!selectedCustomer || wasteItems.length === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Data Penyerahan
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada item sampah yang ditambahkan</p>
                  <p className="text-sm">Pilih customer dan tambahkan item sampah terlebih dahulu</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        {wasteItems.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Ringkasan Penyerahan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{wasteItems.length}</div>
                  <div className="text-sm text-muted-foreground">Jenis Sampah</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {wasteItems.reduce((total, item) => total + item.quantity, 0).toFixed(1)} kg
                  </div>
                  <div className="text-sm text-muted-foreground">Total Berat</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(getTotalAmount())}</div>
                  <div className="text-sm text-muted-foreground">Total Nilai</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedCustomerData?.name || "-"}</div>
                  <div className="text-sm text-muted-foreground">Customer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
