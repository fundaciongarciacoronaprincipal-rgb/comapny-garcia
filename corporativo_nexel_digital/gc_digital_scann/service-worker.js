
const CACHE_NAME = "ggc-digital-scan-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "https://companygarciacorona.com.mx/corporativo_nexel_digital/gc_digital_scann/imagenes/ggc_digital_scan_icono.png"
];

// INSTALACIÓN DE LA APLICACIÓN
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// ACTIVACIÓN Y ACTUALIZACIÓN
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key =>
              key.startsWith("ggc-digital-scan-") &&
              key !== CACHE_NAME
            )
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// CONSULTA Y ALMACENAMIENTO DE ARCHIVOS
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // No interceptar otros dominios ajenos a la aplicación.
  if (
    url.origin !== self.location.origin &&
    url.href !== "https://companygarciacorona.com.mx/corporativo_nexel_digital/gc_digital_scann/imagenes/ggc_digital_scan_icono.png"
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {

        // Si el archivo está guardado, utilizarlo.
        if (cached) {
          return cached;
        }

        // Si no está guardado, solicitarlo a internet.
        return fetch(event.request)
          .then(response => {

            if (
              response &&
              response.status === 200 &&
              (response.type === "basic" ||
               response.type === "cors")
            ) {

              const copia = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, copia);
                });
            }

            return response;
          });
      })
      .catch(() => {

        // Mostrar la página principal sin conexión.
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        // Respuesta cuando no existe conexión.
        return new Response(
          "No hay conexión a internet. Intenta nuevamente.",
          {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          }
        );
      })
  );
});
