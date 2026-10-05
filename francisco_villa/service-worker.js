const CACHE_NAME = 'oftv-fv-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './manifest.json',
        './imagenes/logo_telesecundaria.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      fetch(e.request)
        .then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, res.clone()));
          return res;
        })
        .catch(() => cached || caches.match('./'))
    )
  );
});
