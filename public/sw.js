const CACHE_NAME = 'sosyal-yardim-pwa-v11';

const PRECACHE_ASSETS = [
  '/login',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Install: Cache temel varlıkları
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('SW: Bazı önbellek varlıkları yüklenemedi:', err);
      });
    })
  );
});

// Activate: Eski cache'leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('SW: Eski cache siliniyor:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first, cache fallback
self.addEventListener('fetch', (event) => {
  // Sadece GET isteklerini yakala
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // API çağrıları, WebSocket ve chrome-extension'ları atla
  if (
    url.pathname.startsWith('/api/') ||
    url.protocol === 'chrome-extension:' ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // Harici kaynakları (CDN vs.) doğrudan geçir, cache etme
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('', { status: 408, statusText: 'Request Timeout' });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Başarılı yanıtı cache'e yaz
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Ağ hatası: cache'den sun
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Navigasyon isteği ise login sayfasını sun
          if (event.request.mode === 'navigate') {
            return caches.match('/login').then((loginPage) => {
              if (loginPage) return loginPage;
              // Hiçbir şey bulunamazsa basit offline mesajı
              return new Response(
                `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bağlantı Yok - Sosyal Yardım Sistemi</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #e2e8f0; text-align: center; }
    .box { padding: 2rem; max-width: 360px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; font-size: 0.9rem; }
    button { margin-top: 1.5rem; background: #1d4ed8; color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.75rem; font-size: 1rem; cursor: pointer; }
  </style>
</head>
<body>
  <div class="box">
    <h1>📡 İnternet Bağlantısı Yok</h1>
    <p>Sosyal Yardım Sistemi'ne erişmek için internet bağlantısı gereklidir.</p>
    <button onclick="window.location.reload()">Yeniden Dene</button>
  </div>
</body>
</html>`,
                {
                  status: 200,
                  headers: { 'Content-Type': 'text/html; charset=utf-8' }
                }
              );
            });
          }

          return new Response('Çevrimdışı - Kaynak bulunamadı', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
          });
        });
      })
  );
});
