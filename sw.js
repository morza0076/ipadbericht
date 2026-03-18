// Service Worker – Brugger Formulare PWA
// Versionskonstanten – bei Änderungen hochzählen, um alten Cache zu invalidieren
const CACHE_NAME = 'brugger-v7';
const RUNTIME_CACHE = 'brugger-runtime-v1';

// App-Shell: alle Dateien, die offline verfügbar sein müssen
const PRECACHE_URLS = [
  './',
  './index.html',
  './Logo.PNG',
  './assets/css/app.css',
  './assets/js/app.js',
];

// Install: App-Shell in Cache laden und sofort aktivieren
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: Alte Caches aufräumen und sofort Kontrolle übernehmen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
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

// Fetch: Strategie je nach Anfragetyp
self.addEventListener('fetch', (event) => {
  // Nur GET-Anfragen behandeln
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Navigationsanfragen: Network-first mit Offline-Fallback auf index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Statische Assets (gleiche Origin, /assets/ Pfad): Cache-first
  if (
    requestUrl.origin === self.location.origin &&
    (requestUrl.pathname.includes('/assets/') || PRECACHE_URLS.some((u) => requestUrl.pathname.endsWith(u.replace('./', '/'))))
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          // Nur erfolgreiche Antworten cachen (kein opaque caching)
          if (networkResponse && networkResponse.ok) {
            caches.open(RUNTIME_CACHE).then((cache) =>
              cache.put(event.request, networkResponse.clone())
            );
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Standardstrategie: Network-first, Fallback auf Cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok && networkResponse.type !== 'opaque') {
          caches.open(RUNTIME_CACHE).then((cache) =>
            cache.put(event.request, networkResponse.clone())
          );
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
