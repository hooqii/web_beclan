import { type NextRequest, NextResponse } from "next/server"
import { dummyUsers } from "@/lib/dummy-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = dummyUsers.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()

    // In a real app, you would update in database
    const updatedUser = {
      id: params.id,
      ...userData,
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil diupdate",
      data: updatedUser,
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
      message: "User berhasil dihapus",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
