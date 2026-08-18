import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback';
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore static/public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/workbox-') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.js')
  ) {
    return NextResponse.next();
  }

  // --- 1. GOOGLE GATEKEEPER ---
  const googleSessionCookie = req.cookies.get('google_gate_session')?.value;
  let isGoogleVerified = false;

  if (googleSessionCookie) {
    try {
      const { payload } = await jwtVerify(googleSessionCookie, key, { algorithms: ['HS256'] });
      if (payload.isGoogleVerified && payload.email === 'edirnesydv@gmail.com') {
        isGoogleVerified = true;
      }
    } catch (err) {
      // Invalid google session
    }
  }

  // Allow passing to the google verification API
  if (pathname.startsWith('/api/auth/google')) {
    return NextResponse.next();
  }

  if (!isGoogleVerified) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen ana sayfadan Google ile giriş yapın.' }, { status: 401 });
    }
    if (pathname !== '/gate') {
      return NextResponse.redirect(new URL('/gate', req.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/gate' && isGoogleVerified) {
    // Already verified, no need to be at the gate
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // --- 2. INTERNAL APP SESSION ---
  // Allow passing to the login API
  if (pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // If path is /login, they are allowed to see it since they passed the gate
  if (pathname === '/login') {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('session')?.value;

  if (!sessionCookie) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });

    if (payload.needsSetup && !pathname.startsWith('/api/auth/setup')) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Şifre belirlemeniz gerekmektedir.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/personnel') && payload.role !== 'manager') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Geçersiz oturum. Lütfen tekrar giriş yapın.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|sw.js|workbox-.*|.*\\.(?:png|jpg|jpeg|svg|ico|js)).*)',
  ],
};
