import { type NextRequest, NextResponse } from "next/server"
import { dummyDrivers } from "@/lib/dummy-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredDrivers = [...dummyDrivers]

    // Filter by status if specified
    if (status) {
      filteredDrivers = filteredDrivers.filter((driver) => driver.status === status)
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase()
      filteredDrivers = filteredDrivers.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchLower) ||
          driver.phone.includes(search) ||
          driver.vehicleNumber.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredDrivers,
      total: filteredDrivers.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const driverData = await request.json()

    // In a real app, you would save to database
    const newDriver = {
      id: (dummyDrivers.length + 1).toString(),
      ...driverData,
      createdAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      message: "Driver berhasil ditambahkan",
      data: newDriver,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
