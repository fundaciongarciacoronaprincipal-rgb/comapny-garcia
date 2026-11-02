const CACHE_NAME = "grupo-garcia-corona-trabajo-v3";
const APP_ROOT = "/trabajo/";

self.addEventListener("install", event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        // No se bloquea la instalación si algún recurso opcional falla.
        for (const url of [APP_ROOT, APP_ROOT + "index.html", APP_ROOT + "manifiesto.webmanifiesto"]) {
            try {
                const response = await fetch(url, { cache: "reload" });
                if (response.ok) await cache.put(url, response);
            } catch (error) {
                console.warn("No se pudo precargar:", url, error);
            }
        }
        await self.skipWaiting();
    })());
});

self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys
            .filter(key => key.startsWith("grupo-garcia-corona-") && key !== CACHE_NAME)
            .map(key => caches.delete(key)));
        await self.clients.claim();
    })());
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET" ||
        url.origin !== self.location.origin ||
        !url.pathname.startsWith(APP_ROOT)) return;

    if (request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const response = await fetch(request);
                if (response && response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }
                return response;
            } catch (error) {
                const cache = await caches.open(CACHE_NAME);
                return (await cache.match(request)) ||
                       (await cache.match(APP_ROOT)) ||
                       (await cache.match(APP_ROOT + "index.html")) ||
                       new Response("Sin conexión a internet.", {
                           status: 503,
                           headers: { "Content-Type": "text/plain; charset=utf-8" }
                       });
            }
        })());
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);

        try {
            const response = await fetch(request);
            if (response && response.ok) {
                await cache.put(request, response.clone());
            }
            return response;
        } catch (error) {
            return cached || Response.error();
        }
    })());
});
