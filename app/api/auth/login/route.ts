import { type NextRequest, NextResponse } from "next/server"

// Dummy credentials for demo purposes
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  role: "admin",
}

const OPERATOR_CREDENTIALS = {
  username: "operator",
  password: "operator123",
  role: "operator",
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json()

    // Validate credentials based on role
    let isValid = false
    let userData = null

    if (role === "admin" && username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      isValid = true
      userData = { id: "1", username: ADMIN_CREDENTIALS.username, role: ADMIN_CREDENTIALS.role }
    } else if (
      role === "operator" &&
      username === OPERATOR_CREDENTIALS.username &&
      password === OPERATOR_CREDENTIALS.password
    ) {
      isValid = true
      userData = { id: "2", username: OPERATOR_CREDENTIALS.username, role: OPERATOR_CREDENTIALS.role }
    }

    if (isValid && userData) {
      // In a real app, you would generate a JWT token here
      return NextResponse.json({
        success: true,
        message: "Login berhasil",
        user: userData,
        token: `dummy-token-${userData.role}-${Date.now()}`,
      })
    } else {
      return NextResponse.json({ success: false, message: "Username atau password salah" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
