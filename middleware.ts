import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isLoggedIn() {
  const cookieStore = cookies();
  const token = cookieStore.get("TOKEN");
  if (token) return true
  return false
}

function isAdmin() {
  const cookieStore = cookies()
  const role = cookieStore.get("ROLE")
  if (role?.value === "admin") return true
  return false
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (!isLoggedIn()) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === "/" || pathname === "/login") {
    const newPath = isAdmin() ? "/admin/dashboard" : "/operator/dashboard"
    return NextResponse.redirect(new URL(newPath, request.url))
  }
  if (isAdmin() && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
  if (!isAdmin() && !pathname.startsWith("/operator")) {
    return NextResponse.redirect(new URL('/operator/dashboard', request.url))
  }
  // if (await isBidan() && pathname === "/") {
  //   return NextResponse.rewrite(new URL('/dashboard_bidan', request.url))
  // }

  // const bidanHrefs = bidanNavbars.map((navbar) => navbar.href)
  // if (await isBidan() && !bidanHrefs.includes(pathname)) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
}

export const config = {
  matcher: [
    '/((?!api|login|daftar|_next/static|_next/image|favicon.ico).*)',
  ],
}