import { type NextRequest, NextResponse } from "next/server"
import { dummyUsers } from "@/lib/dummy-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    let filteredUsers = [...dummyUsers]

    // Filter by role if specified
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(search),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: filteredUsers.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // In a real app, you would save to database
    // For now, just return success with the data
    const newUser = {
      id: (dummyUsers.length + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil ditambahkan",
      data: newUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
