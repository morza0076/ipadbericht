// Robuster Service Worker – Brugger Formulare PWA
const CACHE_NAME = 'brugger-v6';
const RUNTIME_CACHE = 'runtime-v1';

// App-Shell: wird beim Install vorgecacht
const PRECACHE_URLS = [
  '/',
  './index.html',
  './Logo.PNG',
  './assets/css/app.css',
  './assets/js/app.js'
];

// Install: App-Shell vorcachen und sofort aktivieren
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: alte Caches löschen und sofort Kontrolle übernehmen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
              return caches.delete(key);
            }
            return null;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: nur GET-Requests verarbeiten
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Navigations-Anfragen: Network-first mit Offline-Fallback auf index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Precached Assets (App-Shell): Cache-first
  const isPrecached = PRECACHE_URLS.some(u => {
    // Normalize './foo' → '/foo', '/' stays '/'
    const norm = u.startsWith('./') ? u.slice(1) : u;
    return url.pathname === norm;
  });

  if (isPrecached || (url.origin === self.location.origin && url.pathname.startsWith('/assets/'))) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          // Nur erfolgreiche, nicht-opaque Antworten cachen
          if (response && response.ok && response.type !== 'opaque') {
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // Sonstige GET-Anfragen: Network-first, Runtime-Cache als Fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Nur ok und nicht-opaque Antworten in Runtime-Cache speichern
        if (response && response.ok && response.type !== 'opaque') {
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
