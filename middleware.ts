import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback';
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all routes except /login and some api routes and public assets
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/icons')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });

    // If needsSetup is true, force redirect to /login (where we will show setup modal)
    // EXCEPT for /api/auth/setup itself
    if (payload.needsSetup && !pathname.startsWith('/api/auth/setup')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Role-based protection
    if (pathname.startsWith('/personnel') && payload.role !== 'manager') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/login (API route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api/auth/login|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
