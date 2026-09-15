/* Ondiva DEMO - service worker que NAO GUARDA NADA.
   Existe por um motivo so: o Chrome no Android so trata a pagina como app
   instalavel (icone proprio, sem o selo do Chrome) quando ha um service worker
   registrado. A decisao de 11/09/2026 ("demo sem service worker") nasceu de um
   problema de CACHE: o sw.js guardava o demo como copia offline do app real.
   Este aqui nao tem cache: toda navegacao vai para a rede, sempre. Sem rede, o
   demo simplesmente nao abre - que e o certo para uma demonstracao.
   Copiado para o clone publico pelo gerar-pages.ps1, como o sw.js. */
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => {
  /* apaga qualquer cache antigo que um sw anterior tenha deixado neste escopo */
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("ondiva-demo")).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => { /* rede pura; o handler precisa existir, nao precisa fazer nada */ });
