import { type NextRequest, NextResponse } from "next/server"
import {
  getTotalPickupsThisMonth,
  getProductQuantitiesThisMonth,
  getRecentPickups,
  getTodaySchedules,
} from "@/lib/dummy-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    if (role === "admin") {
      const totalPickups = getTotalPickupsThisMonth()
      const productQuantities = getProductQuantitiesThisMonth()
      const recentPickups = getRecentPickups()

      return NextResponse.json({
        success: true,
        data: {
          totalPickups,
          productQuantities,
          recentPickups,
        },
      })
    } else if (role === "operator") {
      const todaySchedules = getTodaySchedules()
      const completedToday = todaySchedules.filter((s) => s.status === "completed").length
      const inProgressToday = todaySchedules.filter((s) => s.status === "in-progress").length
      const scheduledToday = todaySchedules.filter((s) => s.status === "scheduled").length

      return NextResponse.json({
        success: true,
        data: {
          todaySchedules,
          completedToday,
          inProgressToday,
          scheduledToday,
        },
      })
    }

    return NextResponse.json({ success: false, message: "Role tidak valid" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
