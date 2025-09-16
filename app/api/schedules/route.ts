import { type NextRequest, NextResponse } from "next/server"
import { dummySchedules } from "@/lib/dummy-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const driverId = searchParams.get("driverId")

    let filteredSchedules = [...dummySchedules]

    // Filter by date if specified
    if (date) {
      filteredSchedules = filteredSchedules.filter((schedule) => schedule.scheduledDate === date)
    }

    // Filter by status if specified
    if (status) {
      filteredSchedules = filteredSchedules.filter((schedule) => schedule.status === status)
    }

    // Filter by driver if specified
    if (driverId) {
      filteredSchedules = filteredSchedules.filter((schedule) => schedule.driverId === driverId)
    }

    return NextResponse.json({
      success: true,
      data: filteredSchedules,
      total: filteredSchedules.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const scheduleData = await request.json()

    // In a real app, you would save to database
    const newSchedule = {
      id: (dummySchedules.length + 1).toString(),
      ...scheduleData,
    }

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil ditambahkan",
      data: newSchedule,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
