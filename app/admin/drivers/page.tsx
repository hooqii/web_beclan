import { Car } from "lucide-react"
import DriversBodyPage from "./drivers_page_body"
import { BASE_URL } from "@/lib/constants"
import { getRequest } from "@/lib/utils"
import Driver, { driverFromJson } from "../../_types/driver"

export default async function DriversPage() {
  const drivers = await fetchDrivers()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-lg p-2">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Kelola Drivers</h1>
              <p className="text-sm text-muted-foreground">Tambah, edit, dan hapus driver sistem</p>
            </div>
          </div>
        </div>
      </div>

      <DriversBodyPage drivers={drivers} />
    </div>
  )
}

async function fetchDrivers() {
  const endpoint = `${BASE_URL}/driver`
  const response = await getRequest<[]>(endpoint)
  const drivers = response.data.map(driverFromJson)
  return drivers
}