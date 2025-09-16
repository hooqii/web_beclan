import { type NextRequest, NextResponse } from "next/server"
import { dummySchedules } from "@/lib/dummy-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const schedule = dummySchedules.find((s) => s.id === params.id)

    if (!schedule) {
      return NextResponse.json({ success: false, message: "Jadwal tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: schedule,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const scheduleData = await request.json()

    // In a real app, you would update in database
    const updatedSchedule = {
      id: params.id,
      ...scheduleData,
    }

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil diupdate",
      data: updatedSchedule,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In a real app, you would delete from database
    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil dihapus",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
