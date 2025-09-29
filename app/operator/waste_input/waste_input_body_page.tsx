"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Trash2, Save, Calculator } from "lucide-react"
import User from "@/app/_types/user"
import Produk from "@/app/_types/produk"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { getToken } from "@/app/_actions/auth"
import { BASE_URL } from "@/lib/constants"
// import { dummyProducts, dummyUsers } from "@/lib/dummy-data"

interface WasteItem {
  idProdukSampah: string
  idUser: string
  berat: number
  harga: number
}

interface WasteInputBodyPageProps {
  users: User[]
  produk: Produk[]
}
export default function WasteInputBodyPage({ users, produk }: WasteInputBodyPageProps) {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([])
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: "",
  })

  const selectedCustomerData = users.find((c) => c.id === selectedCustomer)
  const selectedProductData = produk.find((p) => p.id === newItem.productId)

  const addWasteItem = () => {
    if (newItem.productId && newItem.quantity) {
      const product = produk.find((p) => p.id === newItem.productId)
      if (product) {
        const quantity = Number.parseFloat(newItem.quantity)
        const subtotal = quantity * product.harga

        const wasteItem: WasteItem = {
          idProdukSampah: product.id,
          idUser: selectedCustomer,
          berat: quantity,
          harga: subtotal,
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
    return wasteItems.reduce((total, item) => total + item.harga, 0)
  }

  const handleSave = async () => {
    if (!selectedCustomer || wasteItems.length === 0) {
      return alert("Mohon pilih customer dan tambahkan minimal satu item sampah!")
    }
    
    const token = await getToken()
    const response = await fetch(`${BASE_URL}/setor/add_many`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "setoran": wasteItems
      })
    })
    
    if (response.status !== 201) return
    alert("Berhasil input sampah!")
    setSelectedCustomer("")
    setWasteItems([])
    setNewItem({ productId: "", quantity: "" })
  }
  
  return (
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
                  {users.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.nama} - {customer.alamat.substring(0, 30)}{customer.alamat.length > 30 && "..."}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCustomerData && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">{selectedCustomerData.nama}</h4>
                <p className="text-sm text-muted-foreground">{selectedCustomerData.alamat}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomerData.noHp}</p>
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
                      {produk.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <Image
                            src={product.icon}
                            alt={product.nama}
                            height={20}
                            width={20}
                          />
                          {product.nama} - {formatCurrency(product.harga)}/kg
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
                    {wasteItems.map((item, index) => {
                      const produkItem = produk.find((p) => p.id === item.idProdukSampah)!
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{produkItem.nama}</TableCell>
                          <TableCell>{item.berat} kg</TableCell>
                          <TableCell>{formatCurrency(produkItem.harga)}</TableCell>
                          <TableCell className="font-semibold text-primary">{formatCurrency(item.harga)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => removeWasteItem(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
                  {wasteItems.reduce((total, item) => total + item.berat, 0).toFixed(1)} kg
                </div>
                <div className="text-sm text-muted-foreground">Total Berat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{formatCurrency(getTotalAmount())}</div>
                <div className="text-sm text-muted-foreground">Total Nilai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedCustomerData?.nama || "-"}</div>
                <div className="text-sm text-muted-foreground">Customer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
