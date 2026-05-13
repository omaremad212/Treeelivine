import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password")

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")

  // /dashboard itself is always public (demo mode for unauthenticated visitors)
  const isDemoPublic = nextUrl.pathname === "/dashboard"

  // Sub-pages beyond /dashboard require a session
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/customers") ||
    nextUrl.pathname.startsWith("/products") ||
    nextUrl.pathname.startsWith("/orders") ||
    nextUrl.pathname.startsWith("/suppliers") ||
    nextUrl.pathname.startsWith("/finance") ||
    nextUrl.pathname.startsWith("/reports") ||
    nextUrl.pathname.startsWith("/users") ||
    nextUrl.pathname.startsWith("/settings")

  if (isApiAuthRoute) return NextResponse.next()
  if (isDemoPublic)   return NextResponse.next()

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  })

  const isLoggedIn = !!token

  if (isAuthPage) {
    if (isLoggedIn) return NextResponse.redirect(new URL("/dashboard", nextUrl))
    return NextResponse.next()
  }

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
