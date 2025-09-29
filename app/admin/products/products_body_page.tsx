"use client"

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
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { useState } from "react"
import Produk from "./produk"
import Image from "next/image"
import IconPicker from "./icon_picker"
import { BASE_URL } from "@/lib/constants"
import { getToken } from "@/app/_actions/auth"
import { formatCurrency, getRequest } from "@/lib/utils"

interface NewProduk {
  nama: string
  harga: string
  icon: File | null
}
interface ProductsBodyPageProps {
  products: Produk[]
}
export default function ProductsBodyPage({ products: defaultProducts }: ProductsBodyPageProps) {
  const [products, setProducts] = useState(defaultProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null)
  const [formData, setFormData] = useState<NewProduk>({
    nama: "",
    harga: "",
    icon: null,
  })

  const refreshProducts = async () => {
    const newProducts = await fetchProducts()
    setProducts(newProducts)
  }

  const filteredProducts = products.filter((product) => {
    return product.nama.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleAdd = async () => {
    const { nama, harga, icon } = formData
    if (!nama || !harga || !icon) return

    const data = new FormData()
    data.append("nama", nama)
    data.append("harga", harga)
    data.append("file", icon!)

    const token = await getToken()
    const response = await fetch(`${BASE_URL}/produk_sampah/add`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: data
    })
    if (response.status === 201) refreshProducts()

    setFormData({ nama: "", harga: "", icon: null })
    setIsAddDialogOpen(false)
  }

  const handleEdit = (product: Produk) => {
    setEditingProduct(product)
    setFormData({
      nama: product.nama,
      harga: product.harga.toString(),
      icon: null,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    const { nama, harga, icon } = formData
    const { id } = editingProduct!
    if (!nama || !harga) return

    const data = new FormData()
    data.append("nama", nama)
    data.append("harga", harga)
    if (icon) data.append("file", icon)

    const token = await getToken()
    const response = await fetch(`${BASE_URL}/produk_sampah/edit/${id}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
      body: data
    })
    if (response.status === 200) refreshProducts()
    clearForm()
    setEditingProduct(null)
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const token = await getToken()
      await fetch(`${BASE_URL}/produk_sampah/remove/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      refreshProducts()
    }
  }

  const clearForm = () => {
    setFormData({ nama: "", harga: "", icon: null })
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
              <CardTitle>Produk Sampah</CardTitle>
              <CardDescription>Kelola jenis-jenis sampah dan harganya</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={handleAddOpenChange}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                    <DialogDescription>Tambahkan jenis sampah baru ke dalam sistem</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Produk</Label>
                      <Input
                        id="name"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        placeholder="Contoh: Sampah Organik"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Harga per Unit</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.harga}
                        onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                        placeholder="Contoh: 2000"
                        step={1000}
                      />
                    </div>
                    <div>
                      <IconPicker formData={formData} setFormData={setFormData} />
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
                <TableHead>Icon</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-2xl">
                    <Image src={product.icon} alt={product.nama} height={24} width={24} />
                  </TableCell>
                  <TableCell className="font-medium">{product.nama}</TableCell>
                  <TableCell className="font-semibold text-primary">{formatCurrency(product.harga)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
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
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>Ubah informasi produk sampah</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nama Produk</Label>
              <Input
                id="edit-name"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Harga per Unit</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                step={1000}
              />
            </div>
            <div>
              <IconPicker formData={formData} setFormData={setFormData} />
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

async function fetchProducts() {
  const endpoint = `${BASE_URL}/produk_sampah`
  const response = await getRequest<Produk[]>(endpoint)
  const { data: produk } = response
  return produk
}