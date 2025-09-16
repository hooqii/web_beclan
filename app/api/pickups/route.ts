import { type NextRequest, NextResponse } from "next/server"
import { dummyPickups } from "@/lib/dummy-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const month = searchParams.get("month")

    let filteredPickups = [...dummyPickups]

    // Filter by status if specified
    if (status) {
      filteredPickups = filteredPickups.filter((pickup) => pickup.status === status)
    }

    // Filter by month if specified
    if (month) {
      filteredPickups = filteredPickups.filter((pickup) => {
        const pickupDate = new Date(pickup.scheduledDate)
        return pickupDate.getMonth() === Number.parseInt(month) - 1
      })
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPickups = filteredPickups.filter(
        (pickup) =>
          pickup.customerName.toLowerCase().includes(searchLower) ||
          pickup.driverName.toLowerCase().includes(searchLower) ||
          pickup.customerAddress.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredPickups,
      total: filteredPickups.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const pickupData = await request.json()

    // In a real app, you would save to database
    const newPickup = {
      id: (dummyPickups.length + 1).toString(),
      ...pickupData,
      createdAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      message: "Penjemputan berhasil ditambahkan",
      data: newPickup,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
