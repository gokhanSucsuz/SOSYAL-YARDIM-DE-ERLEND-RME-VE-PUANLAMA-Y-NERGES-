import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback';
const key = new TextEncoder().encode(JWT_SECRET);

// Bakım modu durumu için basit bellek içi önbellek (middleware'de fetch'in `next.revalidate` seçeneği çalışmaz).
const MAINTENANCE_CACHE_MS = 15_000;
let maintenanceCache: { value: boolean; at: number } | null = null;

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

  // ÖNEMLİ: Bakım modu endpoint'i middleware'den muaf tutulmalı. Aksi halde middleware
  // aşağıda bu endpoint'e fetch atar, o istek de middleware'e girip tekrar fetch atar...
  // => SONSUZ DÖNGÜ. (Vercel bunu "508 Loop Detected" ile keser, Coolify/Docker'da kesen yoktur
  // ve sayfa sonsuza kadar yüklenir.) Endpoint GET'te herkese açık, POST'ta kendi yetki kontrolünü yapar.
  if (pathname === '/api/settings/maintenance') {
    return NextResponse.next();
  }

  // Fetch maintenance mode
  // NOT: Docker/Coolify arkasında req.nextUrl.origin dış alan adını (ör. http://puanlama.sydv) verir.
  // Bu adrese konteyner içinden gidilmesi proxy üzerinden dolaşır veya asılı kalabilir. Bu yüzden
  // istek konteynerin kendi loopback adresine, kısa bir zaman aşımıyla yapılır ve sonuç bellekte önbelleklenir.
  let isMaintenanceMode = false;
  const now = Date.now();
  /*
  if (maintenanceCache && now - maintenanceCache.at < MAINTENANCE_CACHE_MS) {
    isMaintenanceMode = maintenanceCache.value;
  } else {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
      const internalOrigin =
        process.env.INTERNAL_APP_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;
      const maintenanceRes = await fetch(`${internalOrigin}/api/settings/maintenance`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      if (maintenanceRes.ok) {
        const data = await maintenanceRes.json();
        isMaintenanceMode = !!data.isMaintenanceMode;
        maintenanceCache = { value: isMaintenanceMode, at: now };
      }
    } catch (e) {
      // Fail silently if API is unreachable during build or network issue
    } finally {
      clearTimeout(timeoutId);
    }
  }
  */

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

  // Fetch google login setting for edge runtime
  let isGoogleLoginEnabled = false;
  try {
    const internalOrigin = process.env.INTERNAL_APP_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const googleRes = await fetch(`${internalOrigin}/api/settings/google-login`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (googleRes.ok) {
      const data = await googleRes.json();
      isGoogleLoginEnabled = !!data.isGoogleLoginEnabled;
    }
    clearTimeout(timeoutId);
  } catch (e) {
    // Fail silently, default is false
  }

  // Allow passing to the google verification API
  if (pathname.startsWith('/api/auth/google')) {
    return NextResponse.next();
  }

  if (isGoogleLoginEnabled && !isGoogleVerified && !isSuperAdmin) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen ana sayfadan Google ile giriş yapın.' }, { status: 401 });
    }
    if (pathname !== '/gate') {
      return NextResponse.redirect(new URL('/gate', req.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/gate' && (!isGoogleLoginEnabled || isGoogleVerified)) {
    // Already verified or google login disabled, no need to be at the gate
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // --- 2. INTERNAL APP SESSION ---
  // Allow passing to the login API and fetching users list for login dropdown
  if (
    pathname.startsWith('/api/auth/login') ||
    (req.method === 'GET' && pathname === '/api/users')
  ) {
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
