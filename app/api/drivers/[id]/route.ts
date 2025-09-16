import { type NextRequest, NextResponse } from "next/server"
import { dummyDrivers } from "@/lib/dummy-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const driver = dummyDrivers.find((d) => d.id === params.id)

    if (!driver) {
      return NextResponse.json({ success: false, message: "Driver tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: driver,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const driverData = await request.json()

    // In a real app, you would update in database
    const updatedDriver = {
      id: params.id,
      ...driverData,
    }

    return NextResponse.json({
      success: true,
      message: "Driver berhasil diupdate",
      data: updatedDriver,
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
      message: "Driver berhasil dihapus",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
