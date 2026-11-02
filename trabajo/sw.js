const CACHE_NAME = "grupo-garcia-corona-v1";

const ARCHIVOS = [
    "./",
    "./manifiesto.webmanifiesto"
];

// INSTALACIÓN
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            await Promise.all(
                ARCHIVOS.map(async archivo => {
                    try {
                        await cache.add(archivo);
                    } catch (error) {
                        console.warn("No se pudo almacenar:", archivo);
                    }
                })
            );
        })
    );

    self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

// SOLICITUDES
self.addEventListener("fetch", event => {

    const solicitud = event.request;

    // Solo solicitudes GET
    if (solicitud.method !== "GET") return;

    const url = new URL(solicitud.url);

    // No interceptar páginas externas
    if (url.origin !== self.location.origin) return;

    // Páginas: primero intentar conexión a internet
    if (solicitud.mode === "navigate") {

        event.respondWith(
            fetch(solicitud)
                .then(respuesta => {

                    if (respuesta.ok) {
                        const copia = respuesta.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(solicitud, copia);
                        });
                    }

                    return respuesta;
                })
                .catch(async () => {

                    const cache = await caches.open(CACHE_NAME);

                    return (
                        await cache.match(solicitud) ||
                        await cache.match("./") ||
                        await cache.match("./index.html") ||
                        new Response(
                            "No hay conexión a internet.",
                            {
                                status: 503,
                                headers: {
                                    "Content-Type": "text/plain; charset=utf-8"
                                }
                            }
                        )
                    );
                })
        );

        return;
    }

    // Archivos: utilizar caché y actualizar desde internet
    event.respondWith(
        caches.match(solicitud).then(respuestaCache => {

            const actualizacion = fetch(solicitud)
                .then(respuesta => {

                    if (respuesta.ok) {
                        const copia = respuesta.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(solicitud, copia);
                        });
                    }

                    return respuesta;
                });

            return respuestaCache || actualizacion;
        })
    );
});
