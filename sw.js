// Clube Barbo: guarda a tela do cartão para abrir rápido e funcionar sem internet.
// A consulta dos selos (Google) nunca fica guardada: sempre vem atualizada.
var CACHE = "clube-barbo-v1";
var BASICO = ["/meu-clube.html", "/manifest.webmanifest", "/img/app-192.png", "/img/logo.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASICO); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok && BASICO.indexOf(u.pathname) >= 0) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(u.pathname, cp); }); }
    return r;
  }).catch(function () { return caches.match(u.pathname).then(function (m) { return m || caches.match("/meu-clube.html"); }); }));
});
