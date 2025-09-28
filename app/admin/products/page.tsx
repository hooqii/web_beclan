import { Package } from "lucide-react"
import ProductsBodyPage from "./products_body_page"
import { BASE_URL } from "@/lib/constants"
import { getRequest } from "@/lib/utils"
import Produk from "./produk"

export default async function ProductsPage() {
  const products = await fetchProducts()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-lg p-2">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Kelola Produk Sampah</h1>
              <p className="text-sm text-muted-foreground">Tambah, edit, dan hapus produk sampah</p>
            </div>
          </div>
        </div>
      </div>

      <ProductsBodyPage products={products} />
    </div>
  )
}

async function fetchProducts() {
  const endpoint = `${BASE_URL}/produk_sampah`
  const response = await getRequest<Produk[]>(endpoint)
  const { data: produk } = response
  return produk
}