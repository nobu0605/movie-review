import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from './utils/api/jwt'

const publicRoutes = ['/login', '/register']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  const cookie = await cookies()
  const token = cookie.get('session')?.value || ''

  if (!isPublicRoute) {
    if (!token) return NextResponse.redirect(new URL('/login', req.nextUrl))

    const session = await verifyJwt(token)
    if (!session?.id) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
