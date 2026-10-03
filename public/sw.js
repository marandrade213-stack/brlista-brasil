const CACHE_NAME = 'brlista-app-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)),
      self.skipWaiting(),
    ]),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('brlista-app-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
      self.clients.claim(),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response.ok) return response

          return caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, response.clone()))
            .then(() => response)
        })
        .catch(async () => {
          const cachedPage = await caches.match(request)
          return cachedPage || (await caches.match(OFFLINE_URL))
        }),
    )
    return
  }

  if (url.pathname.startsWith('/_next/static/') || /\.(?:png|svg|ico|webp|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached

        return fetch(request).then((response) => {
          if (!response.ok) return response

          return caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, response.clone()))
            .then(() => response)
        })
      }),
    )
  }
})
