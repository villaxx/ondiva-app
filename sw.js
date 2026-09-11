/* Ondiva service worker: minimo necessario para instalar e abrir sem internet.
   Rede primeiro (o app sempre fresco); sem rede, serve a ultima copia.

   FONTE DE VERDADE: este arquivo, no repositorio privado. O gerar-pages.ps1
   copia para o clone publico a cada publicacao (auditoria 09/2026 — antes so
   existia no clone, e um `git pull` descartava qualquer edicao nao commitada).

   AUDITORIA 09/2026 — tres correcoes:
   1. So o APP (raiz ou index.html) entra no cache. Antes, TODA navegacao do
      escopo era gravada na chave "./" — abrir demo.html e depois o app sem
      rede servia a demonstracao, com filas simuladas, no endereco real.
   2. So resposta boa (r.ok) entra. Antes, um 404/5xx durante o deploy virava
      a copia offline do app.
   3. Versao do cache sobe (v1 -> v2) para descartar qualquer copia
      contaminada que ja exista nos aparelhos. */
const CACHE = "ondiva-v2";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function ehApp(req){
  const p = new URL(req.url).pathname;
  return p.endsWith("/") || p.endsWith("/index.html");
}
self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    if (!ehApp(e.request)) return;   /* demo e qualquer outra pagina: rede pura, sem cache */
    e.respondWith(
      fetch(e.request).then(r => {
        if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put("./", copia)); }
        return r;
      }).catch(() => caches.match("./"))
    );
  }
});
