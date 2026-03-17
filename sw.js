
const CACHE='brugger-v6';
const PRECACHE=['/','/Logo.PNG','/index.html'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(keys=> Promise.all(keys.map(k=> k!==CACHE? caches.delete(k): null))).then(()=> self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith((async()=>{ const cache=await caches.open(CACHE); const cached=await cache.match(e.request); const fetchP=fetch(e.request).then(r=>{ cache.put(e.request,r.clone()); return r; }).catch(()=> cached); return cached||fetchP; })()); });
