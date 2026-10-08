import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/chat', '/vault', '/account']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('visado_token')?.value
  const path = request.nextUrl.pathname
  const host = request.headers.get('host')?.split(':')[0]

  // Keep operations separate from the customer experience while serving the
  // existing admin routes from the same deployment.
  if (host === 'admin.visadoapp.com') {
    if (path === '/') {
      return NextResponse.rewrite(new URL('/admin', request.url))
    }
    if (path === '/login') {
      return NextResponse.rewrite(new URL('/admin/login', request.url))
    }
  }

  const isProtected = PROTECTED.some(p => path.startsWith(p))
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/vault/:path*', '/account/:path*'],
}
