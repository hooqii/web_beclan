import { Button } from "@/components/ui/button"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import WasteInputBodyPage from "./waste_input_body_page"
import { BASE_URL } from "@/lib/constants"
import { getRequest } from "@/lib/utils"
import Produk from "@/app/_types/produk"
import { userFromJson } from "@/app/_types/user"

export default async function WasteInputPage() {
  const { users, produk } = await fetchUsersAndProducts()
  
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

      <WasteInputBodyPage users={users} produk={produk} />
    </div>
  )
}

interface WasteInputResponse {
  users: []
  produk: Produk[]
}
async function fetchUsersAndProducts() {
  const endpoint = `${BASE_URL}/produk_sampah/operator`
  const response = await getRequest<WasteInputResponse>(endpoint)
  const users = response.data.users.map(userFromJson)
  const { produk } = response.data
  return { users, produk }
}