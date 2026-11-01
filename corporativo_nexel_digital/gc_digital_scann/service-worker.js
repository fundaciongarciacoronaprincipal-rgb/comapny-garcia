const CACHE_NAME = "ggc-digital-scan";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "https://companygarciacorona.com.mx/corporativo_nexel_digital/gc_digital_scann/imagenes/ggc_digital_scan_icono.png",
  "https://companygarciacorona.com.mx/corporativo_nexel_digital/gc_digital_scann/imagenes/ggc_digital_scan_icono.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
        }

        return response;
      }).catch(() => {
        return caches.match("./1.html");
      });
    })
  );
});
