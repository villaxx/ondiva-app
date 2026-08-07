/* Ondiva service worker: minimo necessario para instalar e abrir sem internet.
   Rede primeiro (o app sempre fresco); sem rede, serve a ultima copia. */
const CACHE = "ondiva-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    e.respondWith(
      fetch(e.request).then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put("./", copia));
        return r;
      }).catch(() => caches.match("./"))
    );
  }
});
