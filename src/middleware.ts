import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth: originalMiddleware } = NextAuth(authConfig)

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

export default async function middleware(
  req: any
): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname
  const authRes = await originalMiddleware(req)
  const res = authRes instanceof NextResponse ? authRes : NextResponse.next()

  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    res.headers.set("Content-Security-Policy", csp)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg$).*)'],
}
