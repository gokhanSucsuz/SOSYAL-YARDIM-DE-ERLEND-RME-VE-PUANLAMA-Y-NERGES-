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

// IndexedDB Helper for Offline Queue
const DB_NAME = 'sydv-offline-db';
const STORE_NAME = 'offline-assessments';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveOfflineRequest(requestData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.add({
      url: requestData.url,
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body,
      timestamp: Date.now()
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function syncOfflineRequests() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = async () => {
      const requests = request.result;
      if (!requests || requests.length === 0) return resolve();
      
      for (const req of requests) {
        try {
          const fetchOptions = {
            method: req.method,
            headers: req.headers,
            body: req.body
          };
          const response = await fetch(req.url, fetchOptions);
          if (response.ok) {
            // Silme işlemi
            const deleteTx = db.transaction(STORE_NAME, 'readwrite');
            deleteTx.objectStore(STORE_NAME).delete(req.id);
          }
        } catch (err) {
          console.error('SW: Background sync failed for request', req.id, err);
        }
      }
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Background Sync Event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-assessments') {
    console.log('SW: Background sync tetiklendi');
    event.waitUntil(syncOfflineRequests());
  }
});

// Fetch: Network-first, cache fallback + Offline Intercept
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // POST isteklerini yakala (Çevrimdışı Form Gönderimi için)
  if (event.request.method === 'POST' && url.pathname === '/api/assessments') {
    event.respondWith(
      fetch(event.request.clone()).catch(async () => {
        // Ağ hatası (offline) durumunda IndexedDB'ye kaydet
        const clonedRequest = event.request.clone();
        const body = await clonedRequest.text();
        const headers = {};
        clonedRequest.headers.forEach((val, key) => headers[key] = val);
        
        await saveOfflineRequest({
          url: clonedRequest.url,
          method: clonedRequest.method,
          headers: headers,
          body: body
        });
        
        // Background sync kaydetmeye çalış
        if ('sync' in self.registration) {
          try {
            await self.registration.sync.register('sync-assessments');
          } catch (e) {
            console.error('SW: Sync register hatası', e);
          }
        }
        
        // Frontend'e başarılı gibi 202 Accepted dön
        return new Response(JSON.stringify({ 
          success: true, 
          offline: true, 
          message: 'Çevrimdışı: Veri cihaza kaydedildi, bağlantı geldiğinde aktarılacak.' 
        }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // GET İstekleri için normal Cache stratejisi
  if (event.request.method !== 'GET') return;
  if (
    url.pathname.startsWith('/api/') ||
    url.protocol === 'chrome-extension:' ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('', { status: 408 }))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          if (event.request.mode === 'navigate') {
            return caches.match('/login').then((loginPage) => {
              if (loginPage) return loginPage;
              return new Response(
                `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bağlantı Yok</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#e2e8f0;text-align:center;}.box{padding:2rem;max-width:360px;}button{margin-top:1.5rem;background:#1d4ed8;color:white;border:none;padding:0.75rem 2rem;border-radius:0.75rem;cursor:pointer;}</style></head><body><div class="box"><h1>📡 İnternet Bağlantısı Yok</h1><p>Sisteme erişmek için internet bağlantısı gereklidir.</p><button onclick="window.location.reload()">Yeniden Dene</button></div></body></html>`,
                { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
              );
            });
          }

          return new Response('Çevrimdışı', { status: 503, headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' }) });
        });
      })
  );
});
