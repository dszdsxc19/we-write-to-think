import createMiddleware from 'next-intl/middleware'
import { routing } from './src/navigation'
import { NextRequest } from 'next/server'

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root path to default locale
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone()
    url.pathname = `/${routing.defaultLocale}`
    return Response.redirect(url, 307)
  }

  return handleI18nRouting(request)
}

export const config = {
  matcher: [
    // Skip all paths that should not be internationalized
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames for root and locale-prefixed paths
    '/',
    '/(en|zh)/:path*',
  ],
}
