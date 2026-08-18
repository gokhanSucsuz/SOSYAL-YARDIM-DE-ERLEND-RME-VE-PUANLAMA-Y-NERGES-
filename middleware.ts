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

  // Fetch maintenance mode
  let isMaintenanceMode = false;
  try {
    const maintenanceRes = await fetch(`${req.nextUrl.origin}/api/settings/maintenance`, {
      next: { revalidate: 15 } // Cache for 15 seconds
    });
    if (maintenanceRes.ok) {
      const data = await maintenanceRes.json();
      isMaintenanceMode = data.isMaintenanceMode;
    }
  } catch (e) {
    // Fail silently if API is unreachable during build or network issue
  }

  // Parse session early to know if superadmin
  let sessionPayload: any = null;
  const sessionCookie = req.cookies.get('session')?.value;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
      sessionPayload = payload;
    } catch (e) {
      // Invalid session
    }
  }
  const isSuperAdmin = sessionPayload?.role === 'superadmin';

  // --- MAINTENANCE MODE ENFORCEMENT ---
  if (isMaintenanceMode && !isSuperAdmin) {
    // Allow access to maintenance page and sa-login
    if (
      pathname === '/maintenance' ||
      pathname === '/sa-login' ||
      pathname.startsWith('/api/auth/sa-login') ||
      pathname === '/api/settings/maintenance'
    ) {
      return NextResponse.next();
    }
    
    // Redirect everything else
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Sistem şu an bakımdadır.' }, { status: 503 });
    }
    return NextResponse.redirect(new URL('/maintenance', req.url));
  }

  // If NOT in maintenance mode, redirect away from /maintenance
  if (!isMaintenanceMode && pathname === '/maintenance') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow /sa-login to bypass google gate
  if (pathname === '/sa-login' || pathname.startsWith('/api/auth/sa-login')) {
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

  if (!isGoogleVerified && !isSuperAdmin) {
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

  if (!sessionCookie || !sessionPayload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (sessionPayload.requires2FA) {
    if (!pathname.startsWith('/api/auth/2fa') && pathname !== '/2fa-verify') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: '2FA doğrulaması gereklidir.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/2fa-verify', req.url));
    }
    return NextResponse.next();
  }

  // If they are verified and try to go to 2fa-verify, redirect home
  if (pathname === '/2fa-verify') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (sessionPayload.needsSetup && !pathname.startsWith('/api/auth/setup') && pathname !== '/api/auth/me') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Şifre belirlemeniz gerekmektedir.' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/personnel') && sessionPayload.role !== 'manager' && sessionPayload.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/admin') && sessionPayload.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|sw.js|workbox-.*|.*\\.(?:png|jpg|jpeg|svg|ico|js)).*)',
  ],
};
