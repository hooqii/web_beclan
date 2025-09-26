import { Truck } from "lucide-react"
import PickupPageBody from "./pickup_page_body"
import { BASE_URL } from "@/lib/constants"
import { fetchFromServer } from "@/lib/utils"
import { jsonToPenjemputan } from "./penjemputan"

export default async function PickupsPage() {
  const pickups = await fetchPickups()
  
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

      <PickupPageBody pickups={pickups} />
    </div>
  )
}

async function fetchPickups() {
  const endpoint = `${BASE_URL}/jadwal_jemput/all`
  const { data } = await fetchFromServer<[]>(endpoint)
  const pickups = data.map(jsonToPenjemputan)
  return pickups
}