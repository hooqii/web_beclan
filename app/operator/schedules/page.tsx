import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import SchedulesBodyPage from "./schedules_body_page"
import { BASE_URL } from "@/lib/constants"
import { getRequest } from "@/lib/utils"
import { jadwalFromJson } from "../_types/jadwal"
import User, { userFromJson } from "@/app/_types/user"
import Driver, { driverFromJson } from "@/app/_types/driver"

export default async function SchedulesPage() {
  const { schedules, users, drivers } = await fetchSchedules()

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
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Kelola Jadwal Penjemputan</h1>
              <p className="text-sm text-muted-foreground">Atur dan kelola jadwal penjemputan sampah</p>
            </div>
          </div>
        </div>
      </div>

      <SchedulesBodyPage
        schedules={schedules}
        users={users}
        drivers={drivers}
      />
    </div>
  )
}

interface ScheduleResponse {
  jadwal: []
  users: User[]
  drivers: Driver[]
}
async function fetchSchedules() {
  const endpoint = `${BASE_URL}/jadwal_jemput/operator`
  const response = await getRequest<ScheduleResponse>(endpoint)
  const schedules = response.data.jadwal.map(jadwalFromJson)
  const users = response.data.users.map(userFromJson)
  const drivers = response.data.drivers.map(driverFromJson)
  return { schedules, users, drivers }
}