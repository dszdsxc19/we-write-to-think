import createMiddleware from 'next-intl/middleware'
import { routing } from './navigation'
import { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Root path redirect
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone()
    url.pathname = `/${routing.defaultLocale}`
    url.search = ''
    return Response.redirect(url, 302)
  }

  // Exclude static files, API, and already localized paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    /^\/(en|zh)\//.test(pathname)
  ) {
    return
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: ['/', '/(en|zh)/:path*'],
}
