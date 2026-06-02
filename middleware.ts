import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/chat', '/vault', '/account', '/contact']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('visado_token')?.value
  const path = request.nextUrl.pathname
  const isProtected = PROTECTED.some(p => path.startsWith(p))
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/vault/:path*', '/account/:path*', '/contact/:path*'],
}
